var express = require('express');
var router = express.Router();

const db = require('../database');

// Get general ladder data from all ladders
router.get('/', function(req, res, next) {
    db.any('SELECT ladders.name AS ladder_name, templates.name AS template_name, * FROM ladders, templates WHERE ladders.tid=templates.tid')
    .then((ladders) => {
            res.json({ladders: ladders});
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
                    db.any('SELECT * FROM games WHERE lid=$1 ORDER BY end_date DESC LIMIT 20;',
                        [req.params.ladderId])
                    .then((games) => {
                        db.any('SELECT * FROM daily_standings WHERE lid=$1 ORDER BY date DESC LIMIT 30',
                            [req.params.ladderId])
                        .then ((standings) => {
                            res.json({
                                ladder: ladder,
                                games: games,
                                standings: standings
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
