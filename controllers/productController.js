const formidable = require('formidable');
const debug = require('debug');

const Product = require('../models/productModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');

exports.getAll = (req, res) => {
    Product.queryAll()
        .then(r => {
            res.render('index', { products: r });
        })
        .catch(err => {
            debug.debug(err.message);
        });
}

exports.getOne = async function (req, res) {
    const { id } = req.params;
    const { error } = validation.validateId(id);
    if (error) return res.status(400).send('Bad request');

    Product.queryOne(id)
        .then(r => {
            if (!r) return res.status(404).send('Product not found !');
            res.render('product/detail', { product: r });
        })
        .catch(err => {
            debug.debug(err.message);
            throw err;
        });
}

exports.getOneForUpdate = async function (req, res) {
    const { id } = req.params;
    const { error } = validation.validateId(id);
    if (error) return res.status(400).send('Bad request');

    Product.queryOne(id)
        .then(r => {
            if (!r) return res.status(400).send('Product not found');
            res.render('product/update', { product: r });
        })
        .catch(err => {
            debug.debug(err.message);
            throw err;
        });
}

exports.createOne = function (req, res) {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const { error } = validation.validateProduct(fields);
        fields.picture = myUtil.toBase64(files.picture);
        if (error) {
            res.render('product/create', { product: fields, error: error.details });
            return;
        }
        fields.isForSale = true;
        Product.createOne(fields)
            .then(r => {
                res.render('product/detail', { product: r });
            })
            .catch(err => {
                debug.debug(err.message);
                throw err;
            });
    });
}
 
exports.updateOne = function (req, res) {
    const form = formidable();
    const { id } = req.params;
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const { error } = validation.validateProduct(fields);
        fields.picture = myUtil.toBase64(files.picture);
        if (error) {
            fields._id = id;
            res.render('product/update', { product: fields, error: error.details });
            return;
        }
        Product.updateOne(id, fields)
            .then(r => {
                res.render('product/detail', { product: r });
            })
            .catch(err => {
                debug.debug(err.message);
                throw err;
            });
    });
}

exports.createPage = function (req, res) {
    res.render('product/create');
}

 
