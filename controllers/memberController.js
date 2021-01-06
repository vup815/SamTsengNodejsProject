const axios = require('axios');
const FormData = require('form-data');

const Member = require('../models/memberModel');
const { validateMember } = require('../services/validation');
const myUtil = require('../utils/util');
const productController = require('../controllers/productController');

exports.postLogin = async function (req, res) {
    try {
        let body = req.body;
        const { error } = validateMember(body);
        if (error) return res.render('member/login', { error: error.details });
        Member.queryOne(body.email)
            .then(r => {
                if (r.length === 0) return res.render('member/login', { error: [{ message: 'This account doesn\'t exist' }] });
                const member = r[0];
                if (member.password !== body.password) return res.render('member/login', { error: [{ message: 'Wrong password' }] });
                req.session.user = member;
                productController.getAll(req, res);
            })
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.postRegister = async function (req, res) {
    try {
        let body = req.body;
        const { error } = validateMember(body);
        if (error) return res.render('member/register', { error: error.details });

        let isExist = false;
        await Member.queryOne(body.email)
            .then(r => {
                if (r.length > 0) {
                    isExist = true;
                    res.render('member/register', { error: [{ message: 'This email has been registered' }] });
                }
            })
            .catch(e => { throw new Error(e.message) });

        let memberData = {
            name: body.name,
            email: body.email,
            password: body.password,
            create_date: myUtil.onTime()
        };

        let file = req.file;
        if (file && file.size > 0) {
            let encodedImage = file.buffer.toString('base64');
            let data = new FormData();
            data.append('image', encodedImage);

            var config = {
                method: 'post',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    'Authorization': 'Client-ID 76d2aaac43c004a',
                    ...data.getHeaders()
                },
                data: data
            };
            await axios(config)
                .then(r => memberData.img = r.data.data.link)
                .catch(e => { throw new Error(e.message) });
        }

        if (!isExist) {
            Member.register(memberData)
                .then(() => res.render('member/login', { error: [] }))
                .catch(e => {
                    throw new Error(e.message);
                });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.logout = (req, res) => {
    if (req.session) req.session.user = undefined;
    productController.getAll(req, res);
}

exports.getRegister = (req, res) => {
    res.render('member/register', { error: [] });
}
exports.getLogin = (req, res) => {
    res.render('member/login', { error: [] });
}
