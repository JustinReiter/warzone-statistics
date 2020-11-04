const db = require('./database');
const warzoneAPI = require('./warzoneAPI').default;

function fetchGameData(gameid, ladderid) {
    let gameData = warzoneAPI.getLadderGameData(gameid);

    let gameObj = {
        gid: Number(gameData.id),
        lid: ladderid,
        turns: Number(gameData.numberOfTurns),
        winner: Number(gameData.players[0].state === "Won"),
        booted: gameData.players.filter((player) => player.state === "Booted").length > 0,
        start_data: new Date(gameData.created).toISOString().slice(0, 19).replace('T', ' '),
        end_date: new Date(gameData.lastTurnTime).toISOString().slice(0, 19).replace('T', ' '),
        player0_id: Number(gameData.players[0].id),
        player0_colour: gameData.players[0].color.substring(1),
        player0_name: gameData.players[0].name,
        player1_id: Number(gameData.players[1].id),
        player1_colour: gameData.players[1].color.substring(1),
        player1_name: gameData.players[1].name
    };

    return gameObj;
}

function updateLadderDatabase(ladder, ladderData) {
    // Update ladder game count
    db.none('UPDATE ladders SET game_count=$1, last_updated=NOW() WHERE lid=$2',
        [ladder.game_count+ladderData.length, ladder.lid])
    .then(() => {
        console.log(`Successfully updated game count for ${ladder.name} from ${ladder.game_count} to ${ladder.game_count + ladderData.length}`);
    }).catch((err) => {
        throw err;
    });

    for (const game of ladderData) {
        // Insert game into database
        db.none('INSERT INTO games (gid, lid, winner, booted, turns, start_date, end_date, player0_id, player0_colour, player1_id, player1_colour) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
            [game.gid, game.lid, game.turns, game.booted, game.turns, game.start_date, game.end_date, game.player0_id, game.player0_colour, game.player1_id, game.player1_colour])
        .then(() => {
            console.log(`Inserted new game into the database (game id: ${game.gid})`);
        }).catch((err) => {
            throw err;
        });

        // Check if player name already exists
        db.any("SELECT * FROM players WHERE pid=$1 AND name=$2 ORDER BY version DESC;",
            [game.player0_id, game.player0_name])
        .then((players) => {
            if (!players || players[0].name != game.player1_name) {
                db.none("INSERT INTO players (pid, name) VALUES ($1, $2);",
                    [game.player0_id, game.player0_name])
                    .then(() => {
                        console.log(`Successfully added (${game.player0_id}, ${game.player0_name})`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });

        db.any("SELECT * FROM players WHERE pid=$1 AND name=$2 ORDER BY version DESC;",
            [game.player1_id, game.player1_name])
        .then((players) => {
            if (!players || players[0].name != game.player1_name) {
                db.none("INSERT INTO players (pid, name) VALUES ($1, $2);",
                    [game.player1_id, game.player1_name])
                    .then(() => {
                        console.log(`Successfully added (${game.player1_id}, ${game.player1_name})`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

function updateLadder(ladder) {
    const games = warzoneAPI.getLadderGameIDs(ladder.lid);
    let newGameData = [];

    for (let i = ladder.game_count; i < games.length; i++) {
        newGameData.push(fetchGameData(games[i], ladder.lid));
    }

    updateLadderDatabase(ladder, newGameData);
}

function updateLadders() {
    db.any("SELECT * FROM ladders;")
    .then((ladders) => {
        for (const ladder of ladders) {
            updateLadder(ladder);
            console.log(`Finished updating ${ladder.name}`);
        }
    })
    .catch((err) => {
        console.log("Unable to grab ladders during updateLadders");
    });
}

function updateDailyStandings() {
    let yesterday = new Date();
    yesterday.setDate(d.getDate() - 1);
    let dateString = yesterday.toISOString().slice(0, 10);
    db.any("SELECT lid, COUNT(*) AS count FROM games WHERE end_date BETWEEN '$1' AND '$1 23:59:59' GROUP BY lid;",
        [dateString, dateString])
    .then((ladders) => {
        for (const ladder of ladders) {
            db.none("INSERT INTO daily_standing (lid, date, games) VALUES ($1, $2, $3)",
                [ladder.lid, dateString, ladder.count])
            .catch((err) => {
                console.log(`Failed to insert new standing for ${ladder.lid}`);
            });
        }
    }).catch((err) => {
        console.log("Unable to grab ladders during updateDailyStandings");
    });
}

module.exports  = {
    updateLadders,
    updateDailyStandings
};
