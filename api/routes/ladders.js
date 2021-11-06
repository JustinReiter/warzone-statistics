var express = require('express');
var router = express.Router();

const db = require('../database');

async function getExtraLadderStats(ladder) {
    let obj = {};

    [obj.players, obj.boots, obj.avgTurns, obj.top5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM team_results WHERE lid=$1;', [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE lid=$1 AND booted=true;', [ladder]),
        db.any('SELECT AVG(turns) FROM games WHERE lid=$1;', [ladder]),
        db.any(`SELECT team_results.team_id, p0.name AS player0_name, p1.name AS player1_name, p2.name AS player2_name, wins, losses 
                    FROM team_results,
                    LEFT JOIN players AS p0 on players.pid=team_results.p0_id
                    LEFT JOIN players AS p1 on players.pid=team_results.p1_id
                    LEFT JOIN players AS p2 on players.pid=team_results.p2_id
                    WHERE lid=$1 ORDER BY wins DESC, losses ASC, elo DESC LIMIT 5;`, [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE AND lid=$1;', [ladder])
    ]);

    return obj;
}

//! TODO: what do I do with this?
async function getAllLadderStats() {
    let obj = {};

    [obj.players, obj.boots, obj.games, obj.avgTurns, obj.top5, obj.active5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM players AS distinct_pids;'),
        db.any('SELECT COUNT(*) FROM games WHERE booted=true;'),
        db.any('SELECT COUNT(*) FROM games;'),
        db.any('SELECT AVG(turns) FROM games'),
        db.any(`SELECT player_results.pid, players.name, SUM(wins) AS wins, SUM(losses) AS losses FROM player_results, players 
                    WHERE player_results.pid=players.pid GROUP BY player_results.pid, name ORDER BY SUM(wins) DESC, SUM(losses) ASC LIMIT 5;`),
        db.any(`SELECT player_results.pid, players.name, COUNT(*) AS count FROM player_results, players 
                    WHERE player_results.pid=players.pid GROUP BY player_results.pid, players.name ORDER BY count DESC LIMIT 5;`),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE;')
    ]);

    return obj;
}

var ladderResponse;

async function cacheLadderResponse() {
    db.any(`SELECT ladder_name, p1.name AS winner_name1, p2.name AS winner_name2, p3.name AS winner_name3, templates.name AS template_name, * FROM templates,
        ladders
        INNER JOIN teams on ladders.winner=teams.team_id
        LEFT JOIN players AS p0 on teams.p0_id=p0.id
        LEFT JOIN players AS p1 on teams.p1_id=p1.id
        LEFT JOIN players AS p2 on teams.p2_id=p2.id
        WHERE ladders.tid=templates.tid AND ladders.seasonal=false ORDER BY lid;`)
    .then(async (ladders) => {
            let ladderArray = [];
            let promiseArray = [];
            for (const ladder of ladders) {
                promiseArray.push(getExtraLadderStats(ladder.lid));
                ladderArray.push(ladder);
            }

            let resolvedArray = await Promise.all(promiseArray);
            for (let i = 0; i < ladderArray.length; i++) {
                ladderArray[i].stats = resolvedArray[i];
            }

            ladderResponse = {ladders: ladderArray, stats: await getAllLadderStats()};
    }).catch((err) => {
        console.log(err);
    });
}

// Get general ladder data from all ladders
router.get('/', async function(req, res, next) {
    // Cache value if it does not exist already
    if (!ladderResponse) await cacheLadderResponse();
    
    res.json(ladderResponse);
});

// Get general ladder data from all ladders
router.get('/id/:ladderId', function(req, res, next) {
    if (req.params.ladderId && !isNaN(req.params.ladderId))  {
        db.any(`SELECT ladder_name, p0.name AS winner_name0, p1.name AS winner_name1, p2.name AS winner_name2, templates.name AS template_name, * FROM templates, 
            ladders
            INNER JOIN teams on ladders.winner=teams.team_id
            LEFT JOIN players AS p0 on teams.p0_id=p0.id
            LEFT JOIN players AS p1 on teams.p1_id=p1.id
            LEFT JOIN players AS p2 on teams.p2_id=p2.id
            WHERE ladders.tid=templates.tid AND ladders.lid=$1;`,
            [req.params.ladderId])
        .then(async (ladder) => {
                if (!ladder) {
                    res.json({error: "No ladder found with ID"});
                } else {
                    // Join the games table with the player tables to grab the player names
                    // Hardcode custom games query for ladder 4009 (Season X -- 4FFA)
                    let gamesPromise = db.any(`SELECT gid, p0.pid AS player0_id, p0.name AS player0_name, p1.pid AS player1_id, p1.name AS player1_name, p2.pid AS player2_id, p2.name AS player2_name,
                                        p3.pid AS player3_id, p3.name AS player3_name, p4.pid AS player4_id, p4.name AS player4_name, p5.pid AS player5_id, p5.name AS player5_name, winner, booted, start_date, end_date, turns
                                        FROM games
                                        LEFT JOIN players AS p0 on game.player0_id=p0.id
                                        LEFT JOIN players AS p1 on game.player1_id=p1.id
                                        LEFT JOIN players AS p2 on game.player2_id=p2.id
                                        LEFT JOIN players AS p3 on game.player3_id=p3.id
                                        LEFT JOIN players AS p4 on game.player4_id=p4.id
                                        LEFT JOIN players AS p5 on game.player5_id=p5.id
                                        WHERE lid=$1 ORDER BY end_date DESC;`,
                                        [req.params.ladderId]);

                    let games, standings, colourData, players = [];
                    [games, standings, colourData, players, ladder[0].stats] = await Promise.all([
                        gamesPromise,
                        db.any('SELECT date, games FROM daily_standings WHERE lid=$1 ORDER BY date DESC LIMIT 30',
                            [req.params.ladderId]),
                        db.any('SELECT colour, wins, losses FROM colour_results WHERE lid=$1 ORDER BY wins DESC, losses ASC', req.params.ladderId),
                        db.any(`SELECT team_results.team_id, p0.id AS player0_id, p0.name AS player0_name, p1.id AS player1_id, p1.name AS player1_name, p2.id AS player2_id, p2.name AS player2_name, wins, losses, elo, COUNT(ladders.winner) AS seasonWins
                                FROM team_results
                                INNER JOIN teams ON team_results.team_id=teams.team_id
                                LEFT JOIN players AS p0 ON p0.pid=teams.p0_id
                                LEFT JOIN players AS p1 ON p1.pid=teams.p1_id
                                LEFT JOIN players AS p2 ON p2.pid=teams.p2_id
                                WHERE team_results.lid=$1 AND ladders.seasonal=false
                                ORDER BY team_results.wins DESC, team_results.losses ASC, team_results.elo desc;`,
                                [req.params.ladderId]),
                        getExtraLadderStats(Number(req.params.ladderId))
                    ]);
                    
                    res.json({
                        ladder: ladder[0],
                        games: games,
                        standings: standings.reverse(),
                        colourData: colourData,
                        players: players,
                    });
                }
            }
        ).catch((err) => {
            console.log(err);
            res.json({error: err});
        });
    } else {
        res.json({error: "Invalid ladder ID provided"});
    }
});

module.exports = {router, cacheLadderResponse};
