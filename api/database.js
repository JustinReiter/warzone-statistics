var mysql = require('mysql');

const config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
};

const connection = mysql.createConnection(config);
connection.connect((err) => {
    if (err) {
        console.log("Unable to establish a connection to the database.");
        console.log(err);
    } else {
        console.log("Successfully connected to the database.");
    }
});

module.exports = connection;
