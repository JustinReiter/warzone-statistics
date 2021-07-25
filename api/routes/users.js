var express = require('express');
var router = express.Router();

const db = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    db.any(`SELECT players.pid, players.name, SUM(wins) AS wins, SUM(losses) AS losses, COUNT(*), COALESCE(seasonWins,0) as seasonWins FROM player_results, players
    left join (select winner, count(winner) as seasonWins from ladders group by winner) as l
    on l.winner=players.pid
    WHERE player_results.pid=players.pid GROUP BY players.pid, players.name, seasonWins ORDER BY SUM(wins) DESC, SUM(losses) ASC;`)
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

                let [gamesFFA, games1v1, standings, seasonWins] = await Promise.all([
                    db.any(`SELECT gid, lid, player0_id, player1_id, player2_id, player3_id, p0.name AS player0_name, p1.name AS player1_name, p2.name AS player2_name, p3.name AS player3_name, winner, booted, start_date, end_date, turns
                        FROM games, players AS p0, players AS p1, players AS p2, players AS p3
                        WHERE ((player0_id=$1 OR player1_id=$1 OR player2_id=$1 OR player3_id=$1) AND lid=4009
                        AND p0.pid=player0_id AND p1.pid=player1_id AND p2.pid=player2_id AND p3.pid=player3_id) ORDER BY end_date DESC;`, [users[0].pid]),
                    db.any(`SELECT gid, lid, player0_id, player1_id, p0.name AS player0_name, p1.name AS player1_name, winner, booted, start_date, end_date, turns
                        FROM games, players AS p0, players AS p1
                        WHERE ((player0_id=$1 OR player1_id=$1) AND lid!=4009
                        AND p0.pid=player0_id AND p1.pid=player1_id) ORDER BY end_date DESC;`, [users[0].pid]),
                    db.any(`SELECT pid, player_results.lid, ladders.name AS season, ladders.tid, templates.name AS template, wins, losses, elo FROM player_results, ladders, templates 
                        WHERE pid=$1 AND player_results.lid=ladders.lid AND ladders.tid=templates.tid
                        ORDER BY player_results.lid DESC;`, [users[0].pid]),
                    db.one(`SELECT COUNT(winner) as wins FROM ladders WHERE ladders.winner=$1;`, [Number(users[0].pid)])
                ]);
                res.json({users: users, games: gamesFFA.concat(games1v1), standings, seasonWins: seasonWins.wins || 0});
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
