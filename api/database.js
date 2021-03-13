var pgp = require('pg-promise')();

var config = {
    connectionString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
    max: 1,
    ssl:{rejectUnauthorized: false}
}
var db = pgp(config);

module.exports = db;
