const session = require('express-session');
const Joi = require('joi');
const formidable = require('formidable');
const fs = require('fs');
const debug = require('debug');

const Member = require('../models/memberModel');
exports.get_login_page = (req,res) => {
    res.render('member/login');
};

exports.get_register_page = (req, res) => {
    res.render('member/register');
};

exports.post_login = async (req, res) => {
    const form = formidable();
    form.parse(req, (err, fields) => {
        if (err) throw err;
        const {error} = validateMember(fields);
        if (error) {
           return res.render('member/login', {member: fields, error: error.details});
        }
        const member = await Member.find({email: fields.email});
        if (!member) {
            return res.render('member/login', {error: 'This email has not been registered'});
        }
        if (member.password !== fields.password) {
            return res.render('member/login', {error: 'Wrong password'});
        }
    });
};

exports.post_register = (req, res) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const {error} = validateMember(fields);
        if (error) {
            return res.render('member/register', {member: fields, error: error.details});
        }
        const member = await Member.find({email: fields.email});
        if (member) {
            return res.render('member/register', {error: 'This email has been registered'});
        }
        Member.create({
            name: fields.name,
            email: fields.email,
            password: fields.password,
            picture: toBase64(files.picture)
        }).then(r => {
            res.render('member/login', {member: r});
        });
    });
};

const memberSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-z0-9A-Z]{8,20}$/).required(),
    r_password: Joi.ref('password')
});

function validateMember(member) {
    return memberSchema.validate(member);
}

function toBase64(file) {
    const picture = fs.readFileSync(file.path);
    return picture.toString('base64');
}