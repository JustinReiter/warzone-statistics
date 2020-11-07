const fs = require('fs');

const ladders = ["Seasonal XLI", "Seasonal XLII"];
const ladderIds = [4075, 4076];

// Returns list of file names
function GetAllGameFiles() {
    let res = fs.readdirSync("./GameData");

    return res;
}

function writeSQLToFile(games, players) {
    let logger = fs.createWriteStream('init_update_game_data.sql');
    let hasSeenSecondLadder = false;

    logger.write(`-- Insert ${ladders[0]} games to database\n`);
    for (const game of games) {
        if (!hasSeenSecondLadder && game.lid == 4076) {
            logger.write(`\n-- Insert ${ladders[1]} games to database\n`);
            hasSeenSecondLadder = true;
        }

        // logger.write(`UPDATE games SET start_date='${game.start_date}', end_date='${game.end_date}' WHERE gid=${game.gid};\n`);
        logger.write(`INSERT INTO games (gid, lid, winner, booted, turns, start_date, end_date, player0_id, player0_colour, player1_id, player1_colour) VALUES (${game.gid}, ${game.lid}, '${game.winner}', ${Boolean(game.booted)}, ${game.turns}, '${game.start_date}', '${game.end_date}', ${game.player0_id}, '${game.player0_colour}', ${game.player1_id}, '${game.player1_colour}');\n`);
    }

    logger.write("\n-- Insert players to database\n");
    for (const [id, name] of Object.entries(players)) {
        logger.write(`INSERT INTO players (pid, name, version) VALUES (${id}, '${name}', 1);\n`);
    }
    
    logger.close();
}

function ReadGameFiles() {
    let dataToOutput = [];
    let playerNamesToOutput = {};
    for (let i = 0; i < ladders.length; i++) {
        let games = fs.readdirSync("./GameData/" + ladders[i]);
        
        for (const game of games) {
            let gameData = JSON.parse(fs.readFileSync("./GameData/" + ladders[i] + "/" + game));

            dataToOutput.push({
                gid: gameData.id,
                lid: ladderIds[i],
                winner: Number(gameData.players[0].state === "Won"),
                booted: Number(gameData.players.filter((player) => player.state === "Booted").length),
                turns: gameData.numberOfTurns,
                start_date: new Date(gameData.created + "Z").toISOString().slice(0, 19).replace('T', ' '),
                end_date: new Date(gameData.lastTurnTime + "Z").toISOString().slice(0, 19).replace('T', ' '),
                player0_id: Number(gameData.players[0].id),
                player0_colour: gameData.players[0].color.substring(1),
                player1_id: Number(gameData.players[1].id),
                player1_colour: gameData.players[1].color.substring(1)
            });

            playerNamesToOutput[Number(gameData.players[0].id)] = gameData.players[0].name;
            playerNamesToOutput[Number(gameData.players[1].id)] = gameData.players[1].name; 
        }
    }

    writeSQLToFile(dataToOutput, playerNamesToOutput);
}

ReadGameFiles();
