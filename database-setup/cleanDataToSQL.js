const fs = require('fs');

const ladders = ["Seasonal I", "Seasonal II", "Seasonal III", "Seasonal IV", "Seasonal V", "Seasonal VI", "Seasonal VII", "Seasonal VIII", "Seasonal IX", "Seasonal X", 
                    "Seasonal XI", "Seasonal XII", "Seasonal XIII", "Seasonal XIV", "Seasonal XV", "Seasonal XVI", "Seasonal XVII", "Seasonal XVIII", "Seasonal XIX", "Seasonal XX",
                    "Seasonal XXI", "Seasonal XXII", "Seasonal XXIII", "Seasonal XXIV", "Seasonal XXV", "Seasonal XXVI", "Seasonal XXVII", "Seasonal XXVIII", "Seasonal XXIX", "Seasonal XXX", 
                    "Seasonal XXXI", "Seasonal XXXII", "Seasonal XXXIII", "Seasonal XXXIV", "Seasonal XXXV", "Seasonal XXXVI", "Seasonal XXXVII", "Seasonal XXXVIII", "Seasonal XXXIX", "Seasonal XL"];
const ladderIds = [4000, 4001, 4002, 4003, 4004, 4005, 4006, 4007, 4008, 4009, 4010, 4011, 4012, 4013, 4014, 4015, 4016, 4017, 4018, 4019, 
                    4020, 4021, 4022, 4023, 4024, 4025, 4026, 4027, 4028, 4029, 4030, 4031, 4032, 4065, 4066, 4067, 4068, 4069, 4070, 4074];

// Returns list of file names
function GetAllGameFiles() {
    let res = fs.readdirSync("./GameData");

    return res;
}

function writeSQLToFile(games, players) {
    let logger = fs.createWriteStream('init_full_game_data.sql');
    
    let ladderPointer = 0;
    logger.write(`-- Insert ${ladders[ladderPointer]} games to database\n`);
    for (const game of games) {
        if (game.lid != ladderIds[ladderPointer]) {
            ladderPointer++;
            logger.write(`\n-- Insert ${ladders[ladderPointer]} games to database\n`);
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
        let games = fs.readdirSync("./GameData/" + (i+1) + "SeasonalGames");
        
        for (const game of games) {
            let gameData = JSON.parse(fs.readFileSync("./GameData/" + (i+1) + "SeasonalGames" + "/" + game));

            dataToOutput.push({
                gid: gameData.id,
                lid: ladderIds[i],
                winner: Number(gameData.players[1].state === "Won"),
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
