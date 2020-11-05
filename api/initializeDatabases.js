const db = require('./database');
const warzoneAPI = require('./warzoneAPI').default;

function populateDailyStandings() {
    db.any('SELECT lid FROM ladders;').then((ladders) => {
        for (const ladder of ladders) {
            db.any('SELECT end_date::date, COUNT(*) as count FROM games WHERE lid=$1 GROUP BY 1 ORDER BY 1;', ladder.lid).then((standings) => {
                for (const day of standings) {
                    db.none('INSERT INTO daily_standings (lid, date, games) VALUES ($1, $2, $3);',
                    [ladder.lid, day.end_date, day.count])
                    .then(() => {
                        console.log(`Successfully inserted ${day.end_date} into daily_standings for ${ladder.lid}`);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = populateDailyStandings;
