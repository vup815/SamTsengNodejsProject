const Joi = require('joi');
const fomidable = require('formidable');
const debug = require('debug');
const toRegister = require('../models/memberModel');

exports.postRegister = function(req, res) {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err){
            debug.debug(err.message);
            throw err;
        }
        
    })
}

const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}