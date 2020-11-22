var express = require('express');
var router = express.Router();

const db = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.any(`SELECT player_results.pid, pname.name, SUM(wins) AS wins, SUM(losses) AS losses, COUNT(*) FROM player_results, 
        (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS pname 
        WHERE player_results.pid=pname.pid GROUP BY player_results.pid, pname.name ORDER BY SUM(wins) DESC, SUM(losses) ASC;`)
    .then((users) => {
        res.json({users: users});
    }).catch((err) => {
        console.log(err);
    });
});


// GET request for users by ID
router.get('/id/:userId', function(req, res, next) {
    if (req.params.userId && !isNaN(req.params.userId))  {
        db.any('SELECT * FROM players WHERE pid=$1 ORDER BY version DESC;',
            [req.params.userId])
        .then((users) => {
            if (users.length) {
                db.any('SELECT * FROM games WHERE player0_id=$1 OR player1_id=$1 ORDER BY end_date DESC LIMIT 20;',
                    [users[0].pid])
                .then((games) => {
                    db.any(`SELECT pid, player_results.lid, wins, losses, elo FROM player_results, ladders WHERE pid=$1 AND player_results.lid=ladders.lid 
                        ORDER BY player_results.lid DESC;`, [users[0].pid])
                    .then((standings) => {
                        res.json({users: users, games: games, standings: standings});
                    }).catch((err) => {
                        console.log(err);
                        res.json({error: "Error while processing query"});
                    });
                }).catch((err) => {
                    console.log(err);
                    res.json({error: "Error while processing query"});
                });
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
            .then((users) => {
                if (users.length) {
                    db.any('SELECT * FROM games WHERE player0_id=$1 OR player1_id=$1 ORDER BY end_date DESC LIMIT 20;',
                        [users[0].pid])
                    .then((games) => {
                        db.any(`SELECT pid, player_results.lid, wins, losses, elo FROM player_results, ladders WHERE pid=$1 AND player_results.lid=ladders.lid 
                            ORDER BY player_results.lid DESC;`, [users[0].pid])
                        .then((standings) => {
                            res.json({users: users, games: games, standings: standings});
                        }).catch((err) => {
                            console.log(err);
                            res.json({error: "Error while processing query"});
                        });
                    }).catch((err) => {
                        console.log(err);
                        res.json({error: "Error while processing query"});
                    });
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
