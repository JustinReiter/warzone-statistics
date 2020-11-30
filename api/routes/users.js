var express = require('express');
var router = express.Router();

const db = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.any(`SELECT player_results.pid, players.name, SUM(wins) AS wins, SUM(losses) AS losses, COUNT(*) FROM player_results, players
        WHERE player_results.pid=players.pid GROUP BY player_results.pid, players.name ORDER BY SUM(wins) DESC, SUM(losses) ASC;`)
    .then((users) => {
        res.json({users: users});
    }).catch((err) => {
        console.log(err);
    });
});


// GET request for users by ID
router.get('/id/:userId', function(req, res, next) {
    if (req.params.userId && !isNaN(req.params.userId))  {
        db.any('SELECT * FROM players WHERE pid=$1;',
            [req.params.userId])
        .then(async (users) => {
            if (users.length) {
                let [games, standings] = await Promise.all([
                    db.any(`SELECT gid, lid, winner, booted, turns, start_date, end_date, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name FROM games,
                        players AS p0, players AS p1 
                        WHERE (player0_id=$1 OR player1_id=$1) AND p0.pid=player0_id AND p1.pid=player1_id ORDER BY end_date DESC;`,
                        [users[0].pid]),
                    db.any(`SELECT pid, player_results.lid, ladders.name AS season, ladders.tid, templates.name AS template, wins, losses, elo FROM player_results, ladders, templates 
                        WHERE pid=$1 AND player_results.lid=ladders.lid AND ladders.tid=templates.tid
                        ORDER BY player_results.lid DESC;`, [users[0].pid])
                ]);
                res.json({users: users, games: games, standings: standings});
            } else {
                res.json({users: users, games: []});
            }
        }).catch((err) => {
            console.log(err);
            res.json({error: "Error while processing query"});
        });
    } else {
        res.json({error: "Invalid player ID provided"});
    }
});

// GET request for users by Name
router.get('/name/:userName', function(req, res, next) {
    if (req.params.userName && req.params.userName.trim())  {
        db.any('SELECT * FROM players WHERE name=$1;',
            [req.params.userName.trim()])
            .then(async (users) => {
                if (users.length) {
                    let [games, standings] = await Promise.all([
                        db.any(`SELECT gid, lid, winner, booted, turns, start_date, end_date, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name FROM games,
                            players AS p0, players AS p1 
                            WHERE (player0_id=$1 OR player1_id=$1) AND p0.pid=player0_id AND p1.pid=player1_id ORDER BY end_date DESC;`,
                            [users[0].pid]),
                        db.any(`SELECT pid, player_results.lid, ladders.name AS season, wins, losses, elo FROM player_results, ladders WHERE pid=$1 AND player_results.lid=ladders.lid 
                            ORDER BY player_results.lid DESC;`, [users[0].pid])
                    ]);
                    res.json({users: users, games: games, standings: standings});
                } else {
                    res.json({users: users, games: []});
                }
            }).catch((err) => {
                console.log(err);
                res.json({error: "Error while processing query"});
            });
    } else {
        res.json({error: "Invalid player name provided"});
    }
});

module.exports = router;
