var pgp = require('pg-promise');
var db = pgp(`postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${proces.env.DB_DATABASE}`);

module.exports = db;
