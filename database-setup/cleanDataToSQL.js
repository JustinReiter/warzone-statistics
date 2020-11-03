const fs = require('fs');

const ladders = ["Seasonal XLI", "Seasonal XLII"];
const ladderIds = [4075, 4076];

// Returns list of file names
function GetAllGameFiles() {
    let res = fs.readdirSync("./GameData");

    return res;
}

function writeSQLToFile(games) {
    let logger = fs.createWriteStream('init_game_data.sql');
    let hasSeenSecondLadder = false;

    logger.write(`-- Insert ${ladders[0]} games to database\n`);
    for (const game of games) {
        if (!hasSeenSecondLadder && game.lid == 4076) {
            logger.write(`\n-- Insert ${ladders[1]} games to database\n`);
            hasSeenSecondLadder = true;
        }

        logger.write(`INSERT INTO games (gid, lid, winner, booted, turns, start_date, end_date, player0_id, player0_colour, player1_id, player1_colour) VALUES (${game.gid}, ${game.lid}, ${game.winner}, ${game.booted}, ${game.turns}, '${game.start_date}', '${game.end_date}', ${game.player0_id}, '${game.player0_colour}', ${game.player1_id}, '${game.player1_colour}');\n`);
    }

    logger.close();
}

function ReadGameFiles() {
    let dataToOutput = [];
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
                // start_date: new Date(gameData.startDate).toISOString().slice(0, 19).replace('T', ' ');,
                end_date: new Date(gameData.lastTurnTime).toISOString().slice(0, 19).replace('T', ' '),
                player0_id: Number(gameData.players[0].id),
                player0_colour: gameData.players[0].color,
                player1_id: Number(gameData.players[1].id),
                player1_color: gameData.players[1].color
            });
        }
    }

    writeSQLToFile(dataToOutput);
}

ReadGameFiles();
