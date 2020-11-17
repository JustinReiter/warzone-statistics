var express = require('express');
var router = express.Router();

const db = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.any(`SELECT * FROM player_results, 
        (SELECT p1.pid, p1.name FROM players AS p1 LEFT OUTER JOIN players AS p2 ON p1.pid=p2.pid AND p1.version < p2.version WHERE p2.pid is null) AS pname 
        WHERE player_results.pid=pname.pid;`)
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
        .then((users) => {
            if (users.length) {
                db.any('SELECT * FROM games WHERE player0_id=$1 OR player1_id=$1 ORDER BY end_date DESC LIMIT 20;',
                    [users[0].pid])
                .then((games) => {
                    res.json({users: users, games: games});
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
                    res.json({users: users, games: games});
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
