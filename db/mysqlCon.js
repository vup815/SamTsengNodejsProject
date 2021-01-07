require('dotenv').config();

const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

module.exports = pool;