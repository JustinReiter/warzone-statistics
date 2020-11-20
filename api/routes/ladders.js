var express = require('express');
var router = express.Router();

const db = require('../database');

async function getExtraLadderStats(ladder) {
    let obj = {};

    [obj.players, obj.boots, obj.avgTurns, obj.top5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM player_results WHERE lid=$1;', [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE lid=$1 AND booted=true;', [ladder]),
        db.any('SELECT AVG(turns) FROM games WHERE lid=$1;', [ladder]),
        db.any(`SELECT player_results.pid, name, wins, losses FROM player_results,
                    (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS players 
                    WHERE lid=$1 AND player_results.pid=players.pid ORDER BY wins DESC, losses ASC, elo DESC LIMIT 5;`, [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE AND lid=$1;', [ladder])
    ]);

    return obj;
}

async function getAllLadderStats(ladder) {
    let obj = {};

    [obj.players, obj.boots, obj.games, obj.avgTurns, obj.top5, obj.active5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM (SELECT DISTINCT pid FROM player_results) AS distinct_pids;'),
        db.any('SELECT COUNT(*) FROM games WHERE booted=true;'),
        db.any('SELECT COUNT(*) FROM games;'),
        db.any('SELECT AVG(turns) FROM games'),
        db.any(`SELECT player_results.pid, name, SUM(wins) AS wins, SUM(losses) AS losses FROM player_results,
                    (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS players 
                    WHERE player_results.pid=players.pid GROUP BY player_results.pid, name ORDER BY SUM(wins) DESC, SUM(losses) ASC LIMIT 5;`),
        db.any(`SELECT player_results.pid, players.name, COUNT(*) AS count FROM player_results,
                    (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS players 
                    WHERE player_results.pid=players.pid GROUP BY player_results.pid, players.name ORDER BY count DESC LIMIT 5;`),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE;')
    ]);

    return obj;
}

// Get general ladder data from all ladders
router.get('/', function(req, res, next) {
    db.any('SELECT ladders.name AS ladder_name, templates.name AS template_name, * FROM ladders, templates WHERE ladders.tid=templates.tid ORDER BY ladders.lid DESC;')
    .then(async (ladders) => {
            let ladderArray = [];
            for (const ladder of ladders) {
                ladder.stats = await getExtraLadderStats(ladder.lid);
                ladderArray.push(ladder);
            }

            res.json({ladders: ladderArray, stats: await getAllLadderStats()});
    }).catch((err) => {
        console.log(err);
        res.json({error: "Error while processing query"});
    });
});

// Get general ladder data from all ladders
router.get('/id/:ladderId', function(req, res, next) {
    if (req.params.ladderId && !isNaN(req.params.ladderId))  {
        db.any('SELECT ladders.name AS ladder_name, templates.name AS template_name, * FROM ladders, templates WHERE ladders.lid=$1 AND ladders.tid=templates.tid;',
            [req.params.ladderId])
        .then((ladder) => {
                if (!ladder) {
                    res.json({error: "No ladder found with ID"});
                } else {
                    // Join the games table with the player tables to grab the player names
                    db.any(`SELECT gid, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name, winner, booted, start_date, end_date, turns
                        FROM games, 
                        (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS p0, 
                        (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS p1 
                        WHERE lid=$1 AND games.player0_id=p0.pid AND games.player1_id=p1.pid ORDER BY end_date DESC;`,
                        [req.params.ladderId])
                    .then((games) => {
                        db.any('SELECT date, games FROM daily_standings WHERE lid=$1 ORDER BY date DESC LIMIT 30',
                            [req.params.ladderId])
                        .then ((standings) => {
                            db.any('SELECT colour, wins, losses FROM colour_results WHERE lid=$1 ORDER BY wins DESC, losses ASC', req.params.ladderId)
                            .then((colourData) => {
                                // Join the player_results and player tables
                                db.any(`SELECT player_results.pid, p.name, wins, losses, elo FROM player_results, 
                                    (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS p 
                                    WHERE lid=$1 AND player_results.pid=p.pid ORDER BY player_results.wins DESC, player_results.losses ASC, player_results.elo DESC;`,
                                    [req.params.ladderId])
                                .then(async (players) => {
                                    ladder[0].stats = await getExtraLadderStats(Number(req.params.ladderId));
                                    res.json({
                                        ladder: ladder[0],
                                        games: games,
                                        standings: standings.reverse(),
                                        colourData: colourData,
                                        players: players,
                                    });
                                }).catch((err) => {
                                    console.log(err);
                                });
                            }).catch((err) => {
                                console.log(err);
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            }
        ).catch((err) => {
            console.log(err);
        });
    } else {
        res.json({error: "Invalid ladder ID provided"});
    }
});

module.exports = router;
