const pool = require('../db/mysqlCon');


exports.register = (memberData) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('INSERT INTO member_info SET ?', memberData, (err, rows) => {
                connection.release();
                if (err) {
                    reject(err);
                    return
                }
                resolve(rows);
            });
        });
    });
}

exports.queryOne = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;
            connection.query('SELECT * FROM member_info WHERE email = ?', email, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
                console.log(result);
            });
        });
    });
}