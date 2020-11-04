var express = require('express');
var router = express.Router();

import connection from '../database';

// Get general ladder data from all ladders
router.get('/', function(req, res, next) {
    connection.query("SELECT * FROM ladders, templates, daily_standings WHERE ladders.lid=templates.lid AND templates.lid=daily_standings.lid;",
        (err, ladders, fields) => {
            if (err) throw err;

            res.json({ladders: ladders});
        }
    );
});

// Get general ladder data from all ladders
router.get('/:ladderId', function(req, res, next) {
    if (req.params.ladderId && !isNaN(req.params.ladderId))  {
        connection.query("SELECT * FROM ladders, templates, daily_standings WHERE ladders.lid=? AND ladders.lid=templates.lid AND templates.lid=daily_standings.lid;",
            [req.params.ladderId],
            (err, ladder, fields) => {
                if (err) throw err;

                if (!ladder) {
                    res.json({error: "No ladder found with ID"});
                } else {

                    connection.query("SELECT * FROM games WHERE lid=? ORDER BY end_date DESC LIMIT 20;",
                        [req.params.ladderId],
                        (err, games, fields) => {
                            if (err) throw err;

                            res.json({
                                ladder: ladder,
                                games: games
                            });
                        }
                    );
                }
            }
        );
    } else {
        res.json({error: "Invalid ladder ID provided"});
    }
});

module.exports = router;
