var pgp = require('pg-promise')();

var config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: 26257,
    ssl: {
        ca: process.env.CERT
    }
}
var db = pgp(config);

module.exports = db;
