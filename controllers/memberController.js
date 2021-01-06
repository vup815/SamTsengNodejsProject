const formidable = require('formidable');
const debug = require('debug');
const axios = require('axios');
const FormData = require('form-data');


const Member = require('../models/memberModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');
const productController = require('../controllers/productController');


exports.postLogin = async function (req, res) {
    const form = formidable();
    form.parse(req, async (err, fields) => {
        if (err) throw err;
        const { error } = validation.validateMember(fields);
        if (error) return res.render('member/login', { error: error.details });
        Member.queryOne(fields.email)
            .then(r => {
                const member = r[0];
                if (r.length === 0) return res.render('member/login', { error: [{ message: 'This account doesn\'t exist' }] });
                if (member.password !== fields.password) return res.render('member/login', { error: [{ message: 'Wrong password' }] });
                req.session.user = {
                    name: member.name,
                    id: member.id
                };
                productController.getAll(req, res);
            })
            .catch(err => {
                debug.debug(err);
            })
    });
}

exports.postRegister = async function (req, res) {
    let body = req.body;
    const { error } = validation.validateMember(body);
    if (error) return res.render('member/register', { error: error.details });

    let isExist = false;
    await Member.queryOne(body.email)
        .then(r => {
            if (r.length > 0) {
                isExist = true;
                res.render('member/register', { error: [{ message: 'This email has been registered' }] });
            }
        });

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
            .catch(e => console.log(e));
    }

    if (!isExist) {
        Member.register(memberData)
            .then(() => res.render('member/login', { error: [] })
                , err => debug.debug(err.message));
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

async function uploadImg(buffer) {
    let encodedImage = buffer.toString('base64');
    options = {
        'method': 'POST',
        'url': 'https://api.imgur.com/3/image',
        'headers': {
            'Authorization': 'Client-ID 76d2aaac43c004a'
        },
        formData: {
            'image': encodedImage
        }
    };
    return new Promise(resolve => {
        request(options, function (error, response) {
            if (error) throw new Error(error);
            let link = JSON.parse(response.body).data.link;
            resolve(link);
        });
    })
}