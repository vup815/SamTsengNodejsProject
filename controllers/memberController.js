const formidable = require('formidable');
const debug = require('debug');

const Member = require('../models/memberModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');

const productController = require('../controllers/productController');


exports.postLogin = async function (req, res) {
    const form = formidable();

    form.parse(req, (err, fields) => {
        if (err) throw err;
        const { error } = validation.validateMember(fields);
        if (error) return res.render('member/login', {error: error.details});
        Member.queryOne(fields.email)
            .then(r => {
                const member = r[0];
                if (r.length === 0) return res.render('member/login', { error: { err: { message: 'This account doesn\'t exist' } } });
                if (member.password !== fields.password) return res.render('member/login', { error: { err: { message: 'Wrong password' } } });
                req.session.user = {
                    name: member.name,
                    id: member.id
                };
                productController.getAll(req, res);
            }, err => {
                return console.log(err);
            })
            .catch(err => {
                debug.debug(err);
            })
    });
}

exports.postRegister = async function (req, res) {
    const form = formidable();
    form.parse(req, async (err, fields) => {
        if (err) throw err;
        const { error } = validation.validateMember(fields);
        if (error) return res.render('member/register', { error: error.details });

        const memberData = {
            name: fields.name,
            email: fields.email,
            password: fields.password,
            create_date: myUtil.onTime()
        }
        let isExist = false;
        await Member.queryOne(memberData.email)
            .then(r => {
                if (r.length > 0) {
                    res.render('member/register', { error: { err: { message: 'This email has been registered' } } });
                    isExist = true;
                }
            }, err => console.log(err));
        if (!isExist) {
            Member.register(memberData)
                .then(r => res.json({ result: 'Success' })
                    , err => console.log(err));
        }
    });
}

exports.getRegister = (req, res) => {
    res.render('member/register');
}
exports.getLogin = (req, res) => {
    res.render('member/login');
}