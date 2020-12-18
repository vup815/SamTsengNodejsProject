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