var express = require('express');
const { TransactionMode } = require('pg-promise');
var router = express.Router();

const db = require('../database');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


// GET request for users by ID
router.get('/id/:userId', function(req, res, next) {
    if (req.params.userId && !isNaN(req.params.userId))  {
        db.any('SELECT * FROM players WHERE pid=$1;',
            [req.params.userId])
        .then((users) => {
            res.json({users: users});
        }).catch((err) => {
            console.log(err);
        });
    }
});

// GET request for users by Name
router.get('/name/:userName', function(req, res, next) {
    if (req.params.userName && req.params.userName.trim())  {
        db.any('SELECT * FROM players WHERE name=$1;',
            [req.params.userName.trim()])
        .then((users) => {
            res.json({users: users});
        }).catch((err) => {
            console.log(err);
        });
    }
});

module.exports = router;
