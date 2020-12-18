const mysql = require('mysql');
const config = require('config');
const pool = mysql.createPool({
    connectionLimit : 10,
    host: config.get('host'),
    user: config.get('user'),
    password: config.get('password'),
    database: config.get('database')
});

module.exports = pool;