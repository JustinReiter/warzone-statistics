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

function formatTeamLadderGameObj(gameObj, teams) {
    for (let i = 0; i < teams.length; i++) {
        let orderedTeam = teams[i].sort((a, b) => Number(a.id) > Number(b.id) ? 1 : -1);
        for (let j = 0; j < orderedTeam.length; j++) {
            gameObj["player" + (i*orderedTeam.length+j) + "_id"] = Number(orderedTeam[j].id);
            gameObj["player" + (i*orderedTeam.length+j) + "_colour"] = orderedTeam[j].color.substring(1)
        }
    }
}

function writeSQLToFile(games, players) {
    let logger = fs.createWriteStream('init_season_10_game_data.sql');
    
    let ladderPointer = 9;
    logger.write(`-- Insert ${ladders[ladderPointer]} games to database\n`);
    for (const game of games) {
        if (game.lid != ladderIds[ladderPointer]) {
            ladderPointer++;
            logger.write(`\n-- Insert ${ladders[ladderPointer]} games to database\n`);
        }

        // logger.write(`UPDATE games SET start_date='${game.start_date}', end_date='${game.end_date}' WHERE gid=${game.gid};\n`);
        logger.write(`INSERT INTO games (gid, lid, winner, booted, turns, start_date, end_date, player0_id, player0_colour, player1_id, player1_colour, player2_id, player2_colour, player3_id, player3_colour) VALUES (${game.gid}, ${game.lid}, '${game.winner}', ${Boolean(game.booted)}, ${game.turns}, '${game.start_date}', '${game.end_date}', ${game.player0_id}, '${game.player0_colour}', ${game.player1_id}, '${game.player1_colour}', ${game.player2_id}, '${game.player2_colour}', ${game.player3_id}, '${game.player3_colour}');\n`);
    }

    logger.write("\n-- Insert players to database\n");
    for (const [id, name] of Object.entries(players)) {
        logger.write(`INSERT INTO players (pid, name) VALUES (${id}, '${name}');\n`);
    }
    
    logger.close();
}

function ReadGameFiles() {
    let dataToOutput = [];
    let teamsToOutput = {};
    let playerNamesToOutput = {};
    // for (let i = 0; i < ladders.length; i++) {
        let i = 4;
        let games = fs.readdirSync("./GameData/3v3LadderGames");
        
        for (const game of games) {
            let gameData = JSON.parse(fs.readFileSync("./GameData/3v3LadderGames/" + game));

            let gameObj = {
                gid: gameData.id,
                lid: ladderIds[i],
                winner: gameData.players.reduce((acc, cur, idx) => { if (cur.state === "Won") acc.push(idx); return acc; }, [])[0],
                booted: Number(gameData.players.filter((player) => player.state === "Booted").length),
                turns: gameData.numberOfTurns,
                start_date: new Date(gameData.created + "Z").toISOString().slice(0, 19).replace('T', ' '),
                end_date: new Date(gameData.lastTurnTime + "Z").toISOString().slice(0, 19).replace('T', ' '),
            };

            if ("team" in gameData.players[0]) {
                // Track teams
                let teams = gameData.players.reduce((prev, cur) => prev[cur.team].push(player), [[], []]);
                for (const team of teams) {
                    let sortedTeam = team.sort((a, b) => Number(a.id) > Number(b.id) ? 1 : -1);
                    if (sortedTeam.length == 2) {
                        if (sortedTeam[0] in teamsToOutput) {
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]] = 0;
                        } else {
                            teamsToOutput[sortedTeam[0]] = {};
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]] = 1;
                        }
                    } else if (sortedTeam.length == 3) {
                        if (!(sortedTeam[0] in teamsToOutput)) {
                            teamsToOutput[sortedTeam[0]] = {};
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]] = 1;
                        }

                        if (sortedTeam[1] in teamsToOutput[sortedTeam[0]]) {
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]][sortedTeam[2]] = 0;
                        } else {
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]] = {};
                            teamsToOutput[sortedTeam[0]][sortedTeam[1]][sortedTeam[2]] = 1;
                        }
                    }
                }

                formatTeamLadderGameObj(gameObj, teams);    
            } else {
                // Seasonal
                for (let i = 0; i < gameData.players.length; i++) {
                    gameObj["player" + i + "_id"] = Number(gameData.players[i].id);
                    gameObj["player" + i + "_colour"] = gameData.players[i].color.substring(1);
                }
            }

            

            dataToOutput.push(gameObj);

            for (const player of gameData.players) {
                playerNamesToOutput[Number(player.id)] = player.name;
            }
        }
    // }

    writeSQLToFile(dataToOutput, playerNamesToOutput);
}

ReadGameFiles();
