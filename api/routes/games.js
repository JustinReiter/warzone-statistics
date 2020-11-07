var express = require('express');
var router = express.Router();

const db = require('../database');
const { formatDateString } = require('../utility');
const GAME_QUERY_LIMIT = 30;

// Get latest games from all ladders
router.get('/', function(req, res, next) {
    db.any('SELECT * FROM games ORDER BY end_date DESC LIMIT $1;', [GAME_QUERY_LIMIT])
    .then((games) => {
            res.json({games: games});
    }).catch((err) => {
        console.log(err);
        res.json({error: "Error while processing query"});
    });
});

// Get latest games from specific ladder
router.get('/ladder/:ladderId', function(req, res, next) {
    if (req.params.ladderId && !isNaN(req.params.ladderId)) {
        db.any('SELECT * FROM games WHERE lid=$1 ORDER BY end_date DESC LIMIT $2;',
            [req.params.ladderId, GAME_QUERY_LIMIT])
        .then((games) => {
                res.json({games: games});
        }).catch((err) => {
            console.log(err);
            res.json({error: "Error while processing query"});
        });
    } else {
        res.json({error: "Invalid ladder ID provided"});
    }
});

// Get latest games from specific ladder (pagination)
router.get('/ladder/:ladderId/page/:page', function(req, res, next) {
    if (req.params.ladderId && !isNaN(req.params.ladderId) && req.params.page && !isNaN(req.params.page) && Number(req.params.page) > 0) {
        db.any('SELECT * FROM games WHERE lid=$1 ORDER BY end_date DESC LIMIT $2 OFFSET $3;',
            [req.params.ladderId, GAME_QUERY_LIMIT, GAME_QUERY_LIMIT * (Number(req.params.page)-1)])
        .then((games) => {
                res.json({games: games});
        }).catch((err) => {
            console.log(err);
            res.json({error: "Error while processing query"});
        });
    } else {
        res.json({error: "Invalid ladder ID or page number provided"});
    }
});

// Get games from specific ladder before specific date/time
router.get('/ladder/:ladderId/before/:before', function(req, res, next) {
    try {
        db.any('SELECT * FROM games WHERE lid=$1 AND end_date<$2 ORDER BY end_date DESC LIMIT $3;',
            [req.params.ladderId, formatDateString(req.params.before), GAME_QUERY_LIMIT])
        .then((games) => {
                res.json({games: games});
        }).catch((err) => {
            console.log(err);
            res.json({error: "Error while processing query"});
        });
    } catch (err) {
        console.log(err);
        res.json({error: "Unable to get games from ladder"});
    }
});

// Get from specific ladder after specific date/time
router.get('/ladder/:ladderId/after/:after', function(req, res, next) {
    try {
        db.any('SELECT * FROM games WHERE lid=$1 AND end_date>$2 ORDER BY end_date DESC LIMIT $3;',
            [req.params.ladderId, formatDateString(req.params.after), GAME_QUERY_LIMIT])
        .then((games) => {
                res.json({games: games});
        }).catch((err) => {
            console.log(err);
            res.json({error: "Error while processing query"});
        });
    } catch (err) {
        console.log(err);
        res.json({error: "Unable to get games from ladder"});
    }
});

module.exports = router;
