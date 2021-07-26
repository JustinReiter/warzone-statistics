var express = require('express');
var router = express.Router();

const db = require('../database');

async function getExtraSeasonStats(season) {
    let obj = {};

    [obj.players, obj.boots, obj.avgTurns, obj.top5, obj.gamesToday] = await Promise.all([
        db.any('SELECT COUNT(*) FROM player_results WHERE lid=$1;', [season]),
        db.any('SELECT COUNT(*) FROM games WHERE lid=$1 AND booted=true;', [season]),
        db.any('SELECT AVG(turns) FROM games WHERE lid=$1;', [season]),
        db.any(`SELECT player_results.pid, players.name, wins, losses FROM player_results, players 
                    WHERE lid=$1 AND player_results.pid=players.pid ORDER BY wins DESC, losses ASC, elo DESC LIMIT 5;`, [season]),
        db.any('SELECT COUNT(*) FROM games WHERE end_date::date=CURRENT_DATE AND lid=$1;', [season])
    ]);

    return obj;
}

async function getAllSeasonStats(season) {
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

var seasonResponse;

async function cacheSeasonalResponse() {
    db.any(`SELECT ladder_name, winner_name, templates.name AS template_name, * FROM templates, 
        (SELECT ladders.name AS ladder_name, players.name AS winner_name, * FROM ladders LEFT JOIN players ON ladders.winner=players.pid) AS ladders
        WHERE ladders.tid=templates.tid and ladders.seasonal=true ORDER BY lid DESC;`)
    .then(async (seasons) => {
            let seasonArray = [];
            let promiseArray = [];
            for (const season of seasons) {
                promiseArray.push(getExtraSeasonStats(season.lid));
                seasonArray.push(season);
            }

            let resolvedArray = await Promise.all(promiseArray);
            for (let i = 0; i < seasonArray.length; i++) {
                seasonArray[i].stats = resolvedArray[i];
            }

            seasonResponse = {ladders: seasonArray, stats: await getAllSeasonStats()};
    }).catch((err) => {
        console.log(err);
    });
}

// Get general season data from all seasons
router.get('/', async function(req, res, next) {
    // Cache value if it does not exist already
    if (!seasonResponse) await cacheSeasonalResponse();
    
    res.json(seasonResponse);
});

// Get general season data from all seasons
router.get('/id/:seasonId', function(req, res, next) {
    if (req.params.seasonId && !isNaN(req.params.seasonId))  {
        db.any(`SELECT ladder_name, winner_name, templates.name AS template_name, * FROM templates, 
            (SELECT ladders.name AS ladder_name, players.name AS winner_name, ladders.winner, * FROM ladders LEFT JOIN players ON ladders.winner=players.pid) AS ladders
            WHERE ladders.tid=templates.tid AND ladders.lid=$1 AND ladders.seasonal=true;`,
            [req.params.seasonId])
        .then(async (season) => {
                if (!season) {
                    res.json({error: "No ladder found with ID"});
                } else {
                    // Join the games table with the player tables to grab the player names
                    // Hardcode custom games query for ladder 4009 (Season X -- 4FFA)
                    let gamesPromise;
                    if (req.params.seasonId === "4009") {
                        gamesPromise = db.any(`SELECT gid, player0_id, player1_id, player2_id, player3_id, p0.name AS player0_name, p1.name AS player1_name, p2.name AS player2_name, p3.name AS player3_name, winner, booted, start_date, end_date, turns
                                            FROM games, players AS p0, players AS p1, players AS p2, players AS p3
                                            WHERE lid=$1 AND games.player0_id=p0.pid AND games.player1_id=p1.pid 
                                            AND games.player2_id=p2.pid AND games.player3_id=p3.pid ORDER BY end_date DESC;`,
                                            [req.params.seasonId]);
                    } else {
                        gamesPromise = db.any(`SELECT gid, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name, winner, booted, start_date, end_date, turns
                                            FROM games, players AS p0, players AS p1 
                                            WHERE lid=$1 AND games.player0_id=p0.pid AND games.player1_id=p1.pid ORDER BY end_date DESC;`,
                                            [req.params.seasonId]);
                    }

                    let games, standings, colourData, players = [];
                    [games, standings, colourData, players, season[0].stats] = await Promise.all([
                        gamesPromise,
                        db.any('SELECT date, games FROM daily_standings WHERE lid=$1 ORDER BY date DESC LIMIT 30',
                            [req.params.seasonId]),
                        db.any('SELECT colour, wins, losses FROM colour_results WHERE lid=$1 ORDER BY wins DESC, losses ASC', req.params.seasonId),
                        db.any(`SELECT player_results.pid, players.name, wins, losses, elo, COUNT(ladders.winner) AS seasonWins
                        FROM player_results, players 
                        left join ladders
                        on ladders.winner=players.pid
                        WHERE player_results.lid=$1 AND player_results.pid=players.pid AND ladders.seasonal=true
                        group by ladders.winner, player_results.pid, player_results.wins, player_results.losses, player_results.elo, players.name
                        ORDER BY player_results.wins DESC, player_results.losses ASC, player_results.elo desc;`,
                                [req.params.seasonId]),
                            getExtraSeasonStats(Number(req.params.seasonId))
                    ]);
                    
                    res.json({
                        ladder: season[0],
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
        res.json({error: "Invalid season ID provided"});
    }
});

module.exports = {router, cacheSeasonalResponse};
