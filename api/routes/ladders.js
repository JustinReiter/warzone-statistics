var express = require('express');
var router = express.Router();

const db = require('../database');

// Get general ladder data from all ladders
router.get('/', function(req, res, next) {
    console.log("Running ladders");
    db.any("SELECT * FROM ladders, templates, daily_standings WHERE ladders.tid=templates.tid AND ladders.lid=daily_standings.lid;")
    .then((ladders) => {
            res.json({ladders: ladders});
    }).catch((err) => {
        console.log(err);
    })
});

// Get general ladder data from all ladders
router.get('/:ladderId', function(req, res, next) {
    console.log("Running ladder id");
    if (req.params.ladderId && !isNaN(req.params.ladderId))  {
        db.any("SELECT * FROM ladders, templates, daily_standings WHERE ladders.lid=$1 AND ladders.tid=templates.tid AND ladders.lid=daily_standings.lid;",
            [req.params.ladderId])
        .then((ladder) => {
                if (!ladder) {
                    res.json({error: "No ladder found with ID"});
                } else {
                    db.any("SELECT * FROM games WHERE lid=$1 ORDER BY end_date DESC LIMIT 20;",
                        [req.params.ladderId])
                    .then((games) => {
                            res.json({
                                ladder: ladder,
                                games: games
                            });
                        }
                    ).catch((err) => {
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
