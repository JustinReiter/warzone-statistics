const db = require('./database');
const warzoneAPI = require('./warzoneAPI').default;

function populateDailyStandings() {
    db.any('SELECT lid FROM ladders;').then((ladders) => {
        for (const ladder of ladders) {
            db.any('SELECT end_date::date, COUNT(*) as count FROM games WHERE lid=$1 GROUP BY 1 ORDER BY 1;', ladder.lid).then((standings) => {
                for (const day of standings) {
                    db.none('INSERT INTO daily_standings (lid, date, games) VALUES ($1, $2, $3);',
                    [ladder.lid, day.end_date, day.count])
                    .then(() => {
                        console.log(`[PopulateDailyStandings] Successfully inserted ${day.end_date} into daily_standings for ${ladder.lid}`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

// Populates the colour_results table with values
// Entries are for a single colour/ladder pair
function populateColourResults() {
    db.any('SELECT * FROM games;').then((games) => {
        // data: { <ladderid> : { <colour>: {wins, losses}, ...}, ...}
        let data = {};

        for (const game of games) {
            if (!(game.lid in data)) {
                data[game.lid] = {};
            }

            if (!(game.player0_colour in data[game.lid])) {
                data[game.lid][game.player0_colour] = {wins: 0, losses: 0};
            }
            if (!(game.player1_colour in data[game.lid])) {
                data[game.lid][game.player1_colour] = {wins: 0, losses: 0};
            }

            const didPlayer0Win = game.winner === "0";
            if (didPlayer0Win) {
                data[game.lid][game.player0_colour].wins++;
                data[game.lid][game.player1_colour].losses++;
            } else {
                data[game.lid][game.player1_colour].wins++;
                data[game.lid][game.player0_colour].losses++;
            }
        }

        for (const [lid, colourData] of Object.entries(data)) {
            for (const [colour, gameData] of Object.entries(colourData)) {
                db.none('INSERT INTO colour_results (colour, lid, wins, losses) VALUES ($1, $2, $3, $4);',
                    [colour, lid, gameData.wins, gameData.losses])
                .then(() => {
                    console.log(`[PopulateColourStandings] Successfully inserted into colour_results (${colour}, ${lid}, ${gameData.wins}, ${gameData.losses})`);
                })
                .catch((err) => {
                    console.log(err);
                });

            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
}


const STARTING_ELO = 1500;
const K = 32;

function populateEloRatings() {
    db.any('SELECT lid FROM ladders;').then((ladders) => {
        for (const ladder of ladders) {
            db.any('SELECT * FROM games WHERE lid=$1 ORDER BY end_date ASC;',
                [ladder.lid])
            .then((games) => {
                let players = {};

                for (const game of games) {
                    if (!(game.player0_id in players)) {
                        players[game.player0_id] = {wins: 0, losses: 0, elo: STARTING_ELO};
                    }
                    if (!(game.player1_id in players)) {
                        players[game.player1_id] = {wins: 0, losses: 0, elo: STARTING_ELO};
                    }

                    let expectedScorePlayer0 = 1 / (1 + Math.pow(10, (players[game.player1_id].elo - players[game.player0_id].elo) / 400)); 
                    let actualScorePlayer0 = Number(game.winner === "0");

                    players[game.player0_id].elo += K * (actualScorePlayer0 - expectedScorePlayer0);
                    players[game.player1_id].elo += K * (expectedScorePlayer0 - actualScorePlayer0);

                    players[game.player0_id].wins += actualScorePlayer0;
                    players[game.player0_id].losses += !actualScorePlayer0;
                    players[game.player1_id].wins += !actualScorePlayer0;
                    players[game.player1_id].losses += actualScorePlayer0;
                }

                for (const [player, record] of Object.entries(players)) {
                    db.none('INSERT INTO player_results (pid, lid, wins, losses, elo) VALUES ($1, $2, $3, $4, $5)',
                        [player, ladder.lid, record.wins, record.losses, record.elo])
                    .then(() => {
                        console.log(`[PopulatePlayerResults] Successfully inserted into player_results (${player}, ${ladder.lid}, ${record.wins}, ${record.losses}, ${record.elo})`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            });
        }
    });
}

function populateSingleLadderEloRatings(ladder) {
    db.any('SELECT * FROM games WHERE lid=$1 ORDER BY end_date ASC;',
        [ladder])
    .then((games) => {
        let players = {};

        for (const game of games) {
            if (!(game.player0_id in players)) {
                players[game.player0_id] = {wins: 0, losses: 0, elo: STARTING_ELO};
            }
            if (!(game.player1_id in players)) {
                players[game.player1_id] = {wins: 0, losses: 0, elo: STARTING_ELO};
            }

            let expectedScorePlayer0 = 1 / (1 + Math.pow(10, (players[game.player1_id].elo - players[game.player0_id].elo) / 400)); 
            let actualScorePlayer0 = Number(game.winner === "0");

            players[game.player0_id].elo += K * (actualScorePlayer0 - expectedScorePlayer0);
            players[game.player1_id].elo += K * (expectedScorePlayer0 - actualScorePlayer0);

            players[game.player0_id].wins += actualScorePlayer0;
            players[game.player0_id].losses += !actualScorePlayer0;
            players[game.player1_id].wins += !actualScorePlayer0;
            players[game.player1_id].losses += actualScorePlayer0;
        }

        for (const [player, record] of Object.entries(players)) {
            db.none('INSERT INTO player_results (pid, lid, wins, losses, elo) VALUES ($1, $2, $3, $4, $5)',
                [player, ladder, record.wins, record.losses, record.elo])
            .then(() => {
                console.log(`[PopulatePlayerResults] Successfully inserted into player_results (${player}, ${ladder}, ${record.wins}, ${record.losses}, ${record.elo})`);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    });
}

function collapsePlayerNames() {
    db.any('SELECT * FROM players;').then((players) => {
        let playersFinal = {};

        // Grab most recent name
        for (const player of players) {
            if (Number(player.pid) in playersFinal && Number(player.version) > playersFinal[Number(player.pid)].version) {
                playersFinal[Number(player.pid)].name = player.name;
                playersFinal[Number(player.pid)].version = Number(player.version);
            } else if (!(Number(player.pid) in playersFinal)) {
                playersFinal[Number(player.pid)] = { name: player.name, version: Number(player.version)};
            }
        }

        // Reset the table
        db.none('DELETE FROM players;').then(async () => {
            console.log("[CollapsePlayerNames] Successfully deleted all rows from players");

            let increment = 0;
            for (const [pid, player] of Object.entries(playersFinal)) {
                await db.none('INSERT INTO players (pid, name, version) VALUES ($1, $2, 1)', [pid, player.name]);
                console.log(`[CollapsePlayerNames] Successfully inserted (${pid}, ${player.name}) into players`);
                increment++;
            }

            console.log(`[CollapsePlayerNames] Successfully inserted ${increment} players into the players db.`);
        });
    });
}

const STARTING_MU = 25;
const STARTING_SIGMA = 25 / 3;
const { rate, Rating, quality } = require('ts-trueskill');

// Use TrueSkill for Season X (4FFA)
function populateTrueSkillRatings() {
    db.any('SELECT * FROM games WHERE lid=4009 ORDER BY end_date ASC;').then((games) => {
        // playerId ---> {skill: [mu, sigma], rank: int}
        let playerSkills = {};
        // let colourData = {};

        for (const game of games) {
            for (let i = 0; i < 4; i++) {
                // Add new player object to skills Obj if doesnt exist
                if (!(Number(game[`player${i}_id`]) in playerSkills)) {
                    playerSkills[Number(game[`player${i}_id`])] = {skill: [new Rating(STARTING_MU, STARTING_SIGMA)], wins: 0, losses: 0};
                }

                // Add colour value if does not exist
                // if (!(game[`player${i}_colour`] in colourData)) {
                //     colourData[game[`player${i}_colour`]] = {wins: 0, losses: 0};
                // }

                // Update rank and colours for game and wins/losses
                if (i === Number(game.winner)) {
                    playerSkills[Number(game[`player${i}_id`])].rank = 1;
                    playerSkills[Number(game[`player${i}_id`])].wins++;
                    // colourData[game[`player${i}_colour`]].wins++;
                } else {
                    playerSkills[Number(game[`player${i}_id`])].rank = 2;
                    playerSkills[Number(game[`player${i}_id`])].losses++;
                    // colourData[game[`player${i}_colour`]].losses++;
                }
            }

            // Quality of the match (idk why i have this but the docs did)
            const q = quality([playerSkills[Number(game.player0_id)].skill, playerSkills[Number(game.player1_id)].skill,
                playerSkills[Number(game.player2_id)].skill, playerSkills[Number(game.player3_id)].skill]);

            // Adjust ranking
            // console.log(`Before: ${playerSkills[Number(game.player0_id)].skill[0].mu}`);
            const [p0, p1, p2, p3] = rate([playerSkills[Number(game.player0_id)].skill, playerSkills[Number(game.player1_id)].skill,
                    playerSkills[Number(game.player2_id)].skill, playerSkills[Number(game.player3_id)].skill],
                    [playerSkills[Number(game.player0_id)].rank, playerSkills[Number(game.player1_id)].rank,
                    playerSkills[Number(game.player2_id)].rank, playerSkills[Number(game.player3_id)].rank]);
            // console.log(`After: ${playerSkills[Number(game.player0_id)].skill[0].mu}`);

            // Update player skills
            playerSkills[Number(game.player0_id)].skill[0] = new Rating(p0[0]);
            playerSkills[Number(game.player1_id)].skill[0] = new Rating(p1[0]);
            playerSkills[Number(game.player2_id)].skill[0] = new Rating(p2[0]);
            playerSkills[Number(game.player3_id)].skill[0] = new Rating(p3[0]);
        }

        // Update skill values into the player_results database
        for (const [pid, player] of Object.entries(playerSkills)) {
            db.none('INSERT INTO player_results (pid, lid, wins, losses, elo, sigma) VALUES ($1, 4009, $2, $3, $4, $5);',
                [pid, player.wins, player.losses, player.skill[0].mu, player.skill[0].sigma])
            .then(() => {
                console.log(`[PopulateTSRatings] Successfully inserted into player_results (${pid}, 4009, ${player.wins}, ${player.losses}, ${player.skill[0].mu}, ${player.skill[0].sigma})`);
            });
        }

        // Update colour values into the colour_results database
        // for (const [colour, data] of Object.entries(colourData)) {
        //     db.none('INSERT INTO colour_results (colour, lid, wins, losses) VALUES ($1, 4009, $2, $3);',
        //         [colour, data.wins, data.losses])
        //     .then(() => {
        //         console.log(`[PopulateTSRatings] Successfully inserted into colour_results (${colour}, 4009, ${data.wins}, ${data.losses})`);
        //     });
        // }
    });
}

module.exports = {
    populateDailyStandings,
    populateColourResults,
    populateEloRatings,
    populateSingleLadderEloRatings,
    collapsePlayerNames,
    populateTrueSkillRatings
};
