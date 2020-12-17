const mysql = require('mysql');
const debug = require('debug');
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect(err => {
    if (err) {
        debug.debug(err.message);
    }
    console.log('mysql connect success');
});

module.exports = connection;