const formidable = require('formidable');
const debug = require('debug');

const Member = require('../models/memberModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');

exports.postRegister = function (req, res) {
    const form = formidable();
    form.parse(req, (err, fields) => {
        if (err) {
            debug.debug(err.message);
            throw err;
        }
        const { error } = validation.validateMember(fields);
        if (error) {
            return res.json({error: error.details[0].message});
            
            // return res.render('member/register', {error: error});
        }
        const memberData = {
            name: fields.name,
            email: fields.email,
            password: fields.password,
            create_date: myUtil.onTime()
        }
        Member.register(memberData)
            .then(r => {
                // res.render('member/login', {member: r});
                res.json({ result: r });
            }, (err) => {
                res.json({result: err})
            })
            .catch(err => {
                console.log(err);
            })
    });
}



