var express = require('express');
var router = express.Router();

const db = require('../database');

/* GET colour data listings. */
router.get('/', function(req, res, next) {
    db.any('SELECT colour, SUM(wins), SUM(losses) FROM colour_results GROUP BY colour;')
    .then((colourData) => {
        res.send({ colourData: colourData });
    }).catch((err) => {
        console.log(err);
    });
});



module.exports = router;
