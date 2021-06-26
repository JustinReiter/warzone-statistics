const db = require('./database');
const { getLadderGameIDs, getLadderGameData } = require('./warzoneAPI');
const STARTING_ELO = 1500;
const K = 32;

function fetchGameData(gameid, ladderid) {
    let gameData = getLadderGameData(gameid);

    let gameObj = {
        gid: Number(gameData.id),
        lid: ladderid,
        turns: Number(gameData.numberOfTurns),
        winner: Number(gameData.players[1].state === "Won"),
        booted: gameData.players.filter((player) => player.state === "Booted").length > 0,
        start_date: new Date(gameData.created).toISOString().slice(0, 19).replace('T', ' '),
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

async function updateLadderDatabase(ladder, ladderData) {
    // Update ladder game count
    db.none('UPDATE ladders SET game_count=$1, last_updated=NOW() WHERE lid=$2;',
        [Number(ladder.game_count)+ladderData.length, ladder.lid])
    .then(() => {
        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully updated game count from ${ladder.game_count} to ${Number(ladder.game_count) + ladderData.length}`);
    }).catch((err) => {
        console.log(err);
    });

    for (const game of ladderData) {
        // Insert game into database
        db.none('INSERT INTO games (gid, lid, winner, booted, turns, start_date, end_date, player0_id, player0_colour, player1_id, player1_colour) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);',
            [game.gid, Number(game.lid), game.winner.toString(), game.booted, game.turns, game.start_date, game.end_date, game.player0_id, game.player0_colour, game.player1_id, game.player1_colour])
        .then(() => {
            console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Inserted new game into the database (game id: ${game.gid})`);
        }).catch((err) => {
            console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Attempted to insert:\n` + JSON.stringify(game, null, 4));
            console.log(err);
        });

        // Check if first player exists in player database
        db.any('SELECT * FROM players WHERE pid=$1;',
            [game.player0_id, game.player0_name])
        .then((players) => {
            if (players.length === 0) {
                // Insert new player if none exist prior
                db.none('INSERT INTO players (pid, name) VALUES ($1, $2);',
                    [game.player0_id, game.player0_name])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully added (${game.player0_id}, ${game.player0_name})`);
                })
                .catch((err) => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Attempted to insert: ${game.player0_name} (ID: ${game.player0_id$})`);
                    console.log(err);
                });
            } else {
                // Update name of new player if changed from prior record
                if (!players[0] || players[0].name !== game.player0_name) {
                    db.none('UPDATE players SET name=$1 WHERE pid=$2;', [game.player0_name, game.player0_id])
                    .then(() => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully added (${game.player0_id}, ${game.player0_name})`);
                    })
                    .catch((err) => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Attempted to insert: ${game.player0_name} (ID: ${game.player0_id$})`);
                        console.log(err);
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });

        // Check if second player exists in player database
        db.any('SELECT * FROM players WHERE pid=$1;',
            [game.player1_id])
        .then((players) => {
            if (players.length === 0) {
                // Insert new player if none exist prior
                db.none('INSERT INTO players (pid, name) VALUES ($1, $2);',
                    [game.player1_id, game.player1_name])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully added (${game.player1_id}, ${game.player1_name})`);
                })
                .catch((err) => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Attempted to insert: ${game.player1_name} (ID: ${game.player1_id$})`);
                    console.log(err);
                });
            } else {
                // Update name of new player if changed from prior record
                if (!players[0] || players[0].name !== game.player1_name) {
                    db.none('UPDATE players SET name=$1 WHERE pid=$2;', [game.player1_name, game.player1_id])
                    .then(() => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully added (${game.player1_id}, ${game.player1_name})`);
                    })
                    .catch((err) => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Attempted to insert: ${game.player1_name} (ID: ${game.player1_id$})`);
                        console.log(err);
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });


        // Update the colour data
        await db.any('SELECT * FROM colour_results WHERE lid=$1 AND (colour=$2 OR colour=$3);',
            [game.lid, game.player0_colour, game.player1_colour])
        .then((colourData) => {
            let colourObj = {};
            for (const colour of colourData) {
                colourObj[colour.colour] = {wins: colour.wins, losses: colour.losses};
            }

            if (!(game.player0_colour in colourObj)) {
                colourObj[game.player0_colour] = {wins: 0, losses: 0};
            }
            if (!(game.player1_colour in colourObj)) {
                colourObj[game.player1_colour] = {wins: 0, losses: 0};
            }

            colourObj[game.player0_colour].wins += !game.winner;
            colourObj[game.player0_colour].losses += game.winner;
            colourObj[game.player1_colour].wins += game.winner;
            colourObj[game.player1_colour].losses += !game.winner;

            for (const [colour, data] of Object.entries(colourObj)) {
                if (colourData.filter((entry) => entry.colour === colour).length) {
                    db.none('UPDATE colour_results SET wins=$1, losses=$2 WHERE colour=$3 AND lid=$4;',
                        [data.wins, data.losses, colour, ladder.lid])
                    .then(() => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully updated the colour entry (${colour}, ${data.wins}, ${data.losses})`);
                    }).catch((err) => {
                        console.log(err);
                    });
                } else {
                    db.none('INSERT INTO colour_results (colour, lid, wins, losses) VALUES ($1, $2, $3, $4);',
                        [colour, ladder.lid, data.wins, data.losses])
                    .then(() => {
                        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully inserted the colour entry (${colour}, ${data.wins}, ${data.losses})`);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        })
        .catch((err) => {
            console.log(err);
        });

        // Update the player data in player_results
        await db.any('SELECT * FROM player_results WHERE lid=$1 AND (pid=$2 OR pid=$3);', [ladder.lid, game.player0_id, game.player1_id])
        .then((players) => {
            let player0 = players.filter((player) => Number(player.pid) === game.player0_id);
            let player1 = players.filter((player) => Number(player.pid) === game.player1_id);
            
            // Create new record for player 0 if needed
            if (player0.length === 0) {
                player0 = {pid: game.player0_id, wins: 0, losses: 0, elo: STARTING_ELO};
            } else {
                player0 = player0[0];
            }

            // Create new record for player 1 if needed
            if (player1.length === 0) {
                player1 = {pid: game.player1_id, wins: 0, losses: 0, elo: STARTING_ELO};
            } else {
                player1 = player1[0];
            }

            // Update records
            player0.wins += !game.winner;
            player0.losses += game.winner;
            player1.wins += game.winner;
            player1.losses += !game.winner;

            // Update elo
            const expectedPlayer0Score = 1 / (1 + Math.pow(10, (Number(player1.elo)-Number(player0.elo)) / 400));
            const actualPlayer0Score = !game.winner;
            player0.elo = Number(player0.elo) + K * (actualPlayer0Score - expectedPlayer0Score);
            player1.elo = Number(player1.elo) + K * (expectedPlayer0Score - actualPlayer0Score);



            // Update or insert new results for player 0
            if (players.filter((player) => Number(player.pid) === game.player0_id).length) {
                // Was in db already... Update
                db.none('UPDATE player_results SET wins=$1, losses=$2, elo=$3 WHERE lid=$4 AND pid=$5;',
                    [player0.wins, player0.losses, player0.elo, game.lid, game.player0_id])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully updated player results (${game.player0_id}, ${player0.wins}, ${player0.losses}, ${player0.elo})`)
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                // Was not in db already... Insert
                db.none('INSERT INTO player_results (lid, pid, wins, losses, elo) VALUES ($1, $2, $3, $4, $5);',
                    [game.lid, player0.pid, player0.wins, player0.losses, player0.elo])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully inserted player results (${game.player0_id}, ${player0.wins}, ${player0.losses}, ${player0.elo})`)
                }).catch((err) => {
                    console.log(err);
                });
            }

            // Update or insert new results for player 1
            if (players.filter((player) => Number(player.pid) === game.player1_id).length) {
                // Was in db already... Update
                db.none('UPDATE player_results SET wins=$1, losses=$2, elo=$3 WHERE lid=$4 AND pid=$5;',
                    [player1.wins, player1.losses, player1.elo, game.lid, game.player1_id])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully updated player results (${game.player1_id}, ${player1.wins}, ${player1.losses}, ${player1.elo})`)
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                // Was not in db already... Insert
                db.none('INSERT INTO player_results (lid, pid, wins, losses, elo) VALUES ($1, $2, $3, $4, $5);',
                    [game.lid, player1.pid, player1.wins, player1.losses, player1.elo])
                .then(() => {
                    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Successfully inserted player results (${game.player1_id}, ${player1.wins}, ${player1.losses}, ${player1.elo})`)
                }).catch((err) => {
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
    let games = getLadderGameIDs(ladder.lid);
    let newGameData = [];

    console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Found ${games.length} games; ladder game_count: ${ladder.game_count} games (Difference: ${games.length - ladder.game_count})`);

    // Do a set difference between the games from the WZ API and database
    db.any('SELECT gid FROM games WHERE lid=$1;', [ladder.lid]).then((ladderGames) => {
        
        // Remove games already processed
        ladderGames = ladderGames.map((game) => Number(game.gid));
        games = games.filter((game) => !ladderGames.includes(game));

        console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) After removing processed games, ${games.length} games needed to insert`);
        for (const game of games) {
            newGameData.push(fetchGameData(game, ladder.lid));
        }
        
        updateLadderDatabase(ladder, newGameData);
    }).catch((err) => {
        console.log(err);
    });
}

function updateLadders() {
    db.any('SELECT * FROM ladders WHERE active=true;')
    .then((ladders) => {
        for (const ladder of ladders) {
            updateLadder(ladder);
            console.log(`[UpdateLadderGames] ${ladder.name} (ID: ${ladder.lid}) Finished updating games`);
        }
    })
    .catch((err) => {
        console.log("[UpdateLadderGames] Err: Unable to grab ladders during updateLadders");
        console.log(err);
    });
}

function updateDailyStandings() {
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let dateString = yesterday.toISOString().slice(0, 10);
    db.any('SELECT lid, COUNT(*) AS count FROM games WHERE end_date BETWEEN $1 AND $2 GROUP BY lid;',
        [dateString, dateString + ' 23:59:59'])
    .then((ladders) => {
        for (const ladder of ladders) {
            db.none('INSERT INTO daily_standings (lid, date, games) VALUES ($1, $2, $3);',
                [ladder.lid, dateString, ladder.count])
            .then(() => {
                console.log(`[UpdateDailyStandings] Successfully added new entry (${ladder.lid}, ${dateString}, ${ladder.count})`);
            })
            .catch((err) => {
                console.log(`[UpdateDailyStandings] Err: (ID: ${ladder.lid}) Failed to insert new standing`);
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log("[UpdateDailyStandings] Err: Unable to grab ladders");
        console.log(err);
    });
}

module.exports  = {
    updateLadders,
    updateDailyStandings
};
