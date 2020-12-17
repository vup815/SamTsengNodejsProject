const db =require('../db/mysqlCon');
const debug = require('debug');
module.exports = function register (memberData) {
    return new Promise((resolve, reject) => {
         db.query('INSERT INTO member_info SET ?', memberData, (err, rows) => {
             if (err) {
                debug.debug(err.message);
                reject({err: err});
             }
             resolve({member: memberData});
         })
    })
}