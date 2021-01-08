require('dotenv').config();

const axios = require('axios');
const FormData = require('form-data');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

const Member = require('../models/memberModel');
const { validateMember } = require('../services/validation');
const myUtil = require('../utils/util');
const productController = require('../controllers/productController');

exports.postLogin = async function (req, res) {
     
    try {
        let body = req.body;
        const { error } = validateMember(body);
        if (error) return res.render('member/login', { error: error.details });
        let data = await Member.queryOne(body.email);
        if (data.length === 0) {
            return res.render('member/login', { error: [{ message: 'This account doesn\'t exist' }] });
        }
        const member = data[0];
        let match = await bcrypt.compare(body.password, member.password);
        if (match) {
            req.session.user = member;
            productController.getAll(req, res);
        } else {
            return res.render('member/login', { error: [{ message: 'Wrong password' }] });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.postRegister = async function (req, res) {
    try {
        let body = req.body;
        let file = req.file;
        const { error } = validateMember(body);
        if (error) return res.render('member/register', { error: error.details });

        let member = await Member.queryOne(body.email);
        if (member.length > 0) {
            return res.render('member/register', { error: [{ message: 'This email has been registered' }] });
        }

        let memberData = {
            name: body.name,
            email: body.email,
            create_date: myUtil.onTime()
        };
        let promises = [];
        promises.push(bcrypt.hash(body.password, 10));

        if (file && file.size > 0) {
            let encodedImage = file.buffer.toString('base64');
            let data = new FormData();
            data.append('image', encodedImage);

            let config = {
                method: 'post',
                url: 'https://api.imgur.com/3/image',
                headers: {
                    'Authorization': 'Client-ID 76d2aaac43c004a',
                    ...data.getHeaders()
                },
                data: data
            };
            promises.push(axios(config));
        }
        let [password, avatarLink] = await Promise.all(promises)
        memberData.password = password;
        memberData.avatar = avatarLink.data.data.link;
        Member.register(memberData)
            .then(() => res.render('member/login', { error: [] }))
            .catch(e => { throw new Error(e.message) });
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
