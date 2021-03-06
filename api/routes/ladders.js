var express = require('express');
var router = express.Router();

const db = require('../database');

async function getExtraLadderStats(ladder) {
    let obj = {};

    [obj.players, obj.boots, obj.avgTurns, obj.top5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM player_results WHERE lid=$1;', [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE lid=$1 AND booted=true;', [ladder]),
        db.any('SELECT AVG(turns) FROM games WHERE lid=$1;', [ladder]),
        db.any(`SELECT player_results.pid, players.name, wins, losses FROM player_results, players 
                    WHERE lid=$1 AND player_results.pid=players.pid ORDER BY wins DESC, losses ASC, elo DESC LIMIT 5;`, [ladder]),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE AND lid=$1;', [ladder])
    ]);

    return obj;
}

async function getAllLadderStats(ladder) {
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
    db.any(`SELECT ladder_name, winner_name, templates.name AS template_name, * FROM templates, 
        (SELECT ladders.name AS ladder_name, players.name AS winner_name, * FROM ladders LEFT JOIN players ON ladders.winner=players.pid) AS ladders
        WHERE ladders.tid=templates.tid ORDER BY lid DESC;`)
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
        db.any(`SELECT ladder_name, winner_name, templates.name AS template_name, * FROM templates, 
            (SELECT ladders.name AS ladder_name, players.name AS winner_name, ladders.winner, * FROM ladders LEFT JOIN players ON ladders.winner=players.pid) AS ladders
            WHERE ladders.tid=templates.tid AND ladders.lid=$1;`,
            [req.params.ladderId])
        .then(async (ladder) => {
                if (!ladder) {
                    res.json({error: "No ladder found with ID"});
                } else {
                    // Join the games table with the player tables to grab the player names
                    // Hardcode custom games query for ladder 4009 (Season X -- 4FFA)
                    let gamesPromise;
                    if (req.params.ladderId === "4009") {
                        gamesPromise = db.any(`SELECT gid, player0_id, player1_id, player2_id, player3_id, p0.name AS player0_name, p1.name AS player1_name, p2.name AS player2_name, p3.name AS player3_name, winner, booted, start_date, end_date, turns
                                            FROM games, players AS p0, players AS p1, players AS p2, players AS p3
                                            WHERE lid=$1 AND games.player0_id=p0.pid AND games.player1_id=p1.pid 
                                            AND games.player2_id=p2.pid AND games.player3_id=p3.pid ORDER BY end_date DESC;`,
                                            [req.params.ladderId]);
                    } else {
                        gamesPromise = db.any(`SELECT gid, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name, winner, booted, start_date, end_date, turns
                                            FROM games, players AS p0, players AS p1 
                                            WHERE lid=$1 AND games.player0_id=p0.pid AND games.player1_id=p1.pid ORDER BY end_date DESC;`,
                                            [req.params.ladderId]);
                    }

                    let games, standings, colourData, players = [];
                    [games, standings, colourData, players, ladder[0].stats] = await Promise.all([
                        gamesPromise,
                        db.any('SELECT date, games FROM daily_standings WHERE lid=$1 ORDER BY date DESC LIMIT 30',
                            [req.params.ladderId]),
                        db.any('SELECT colour, wins, losses FROM colour_results WHERE lid=$1 ORDER BY wins DESC, losses ASC', req.params.ladderId),
                        db.any(`SELECT player_results.pid, players.name, wins, losses, elo FROM player_results, players 
                                WHERE lid=$1 AND player_results.pid=players.pid ORDER BY player_results.wins DESC, player_results.losses ASC, player_results.elo DESC;`,
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
        });
    } else {
        res.json({error: "Invalid ladder ID provided"});
    }
});

module.exports = {router, cacheLadderResponse};
