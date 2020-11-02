const connection = require('./database');
import { getLadderGameIDs, getLadderGameData } from './warzoneAPI';

function fetchGameData(gameid, ladderid) {
    let gameData = getLadderGameData(gameid);

    let gameObj = {
        gid: Number(gameData.id),
        lid: ladderid,
        turns: Number(gameData.numberOfTurns),
        winner: gameData.players[0].state === "Won",
        end_date: Date(gameData.lastTurnTime),
        player0_id: Number(gameData.players[0].id),
        player0_colour: Number(gameData.players[0].color),
        player0_name: gameData.players[0].name,
        player1_id: Number(gameData.players[1].id),
        player1_colour: Number(gameData.players[1].color),
        player1_name: gameData.players[1].name
    };

    if (gameData.players.filter((player) => player.state === "Booted")) {
        gameObj.booted = 1;
    }

    return gameObj;
}

function updateLadderDatabase(ladder, ladderData) {
    // Update ladder game count
    connection.query('UPDATE ladders SET game_count=? WHERE lid=?',
        [ladder.game_count+ladderData.length, ladder.lid],
        (err, results) => {
            if (err) throw err;
            console.log(`Successfully updated game count for ${ladder.name} from ${ladder.game_count} to ${ladder.game_count + ladderData.length}`);
    });

    for (const game of ladderData) {
        // Insert game into database
        connection.query('INSERT INTO games (gid, lid, winner, booted, turns, end_date, player0_id, player0_colour, player1_id, player1_colour) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
            [game.gid, game.lid, game.turns, game.booted, game.turns, game.end_date, game.player0_id, game.player0_colour, game.player1_id, game.player1_colour],
            (err, results) => {
                if (err) throw err;
                console.log(`Inserted new game into the database (game id: ${game.gid})`);
        });

        // Check if player name already exists
        connection.query("SELECT * FROM players WHERE pid=? AND name=?;",
            [game.player0_id, game.player0_name],
            (err, players) => {
                if (err) throw err;

                if (!players) {
                    connection.query("INSERT INTO players (pid, name) VALUES (?, ?);",
                        [game.player0_id, game.player0_name],
                        (err) => {
                            if (err) throw err;
                            console.log(`Successfully added (${game.player0_id}, ${game.player0_name})`);
                    });
                }
        });

        connection.query("SELECT * FROM players WHERE pid=? AND name=?",
            [game.player1_id, game.player1_id],
            (err, players) => {
                if (err) throw err;

                if (!players) {
                    connection.query("INSERT INTO players (pid, name) VALUES (?, ?);",
                        [game.player1_id, game.player1_name],
                        (err) => {
                            if (err) throw err;
                            console.log(`Successfully added (${game.player1_id}, ${game.player1_name})`);
                    });
                }
        });
    }
}

function updateLadder(ladder) {
    const games = getLadderGameIDs(ladder.lid);
    let newGameData = [];

    for (let i = ladder.game_count; i < games.length; i++) {
        newGameData.push(fetchGameData(games[i], ladder.lid));
    }

    updateLadderDatabase(ladder, newGameData);
}

function updateLadders() {
    connection.query("SELECT * FROM ladders;", function(err, ladders, fields) {
        if (err) throw err;

        for (const ladder of ladders) {
            updateLadder(ladder);
            console.log(`Finished updating ${ladder.name}`);
        }
    });
}

module.exports = updateLadders;
