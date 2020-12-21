const formidable = require('formidable');
const debug = require('debug');

const Product = require('../models/productModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');

exports.getAll = (req, res) => {
    Product.queryAll()
        .then(r => res.render('index', { products: r }))
        .catch(err => debug.debug(err.message));
}

exports.getOne = async function (req, res) {
    const { id } = req.params;
    const { error } = validation.validateId(id);
    if (error) return res.status(400).send('Bad request');
    const isUpdate = (req.query.update === '1') ? true : false
    Product.queryOne(id)
        .then(r => {
            if (!r) return res.status(404).send('Product not found !');
            if (isUpdate) return res.render('products/update', { product: r });
            res.render('products/detail', { product: r });
        })
        .catch(err => debug.debug(err.message));
}

exports.createOne = function (req, res) {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const { error } = validation.validateProduct(fields);
        if (error) return res.render('products/create', { product: fields, error: error.details });

        try { fields.picture = await myUtil.toBase64(files.picture.path); }
        catch (e) { debug.debug(e.message); }

        fields.isForSale = true;
        Product.createOne(fields)
            .then(r => res.render('products/detail', { product: r }))
            .catch(err => debug.debug(err.message));
    });
}

exports.updateOne = function (req, res) {
    const form = formidable();
    const { id } = req.params;
    form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const { error } = validation.validateProduct(fields);
        if (error) {
            fields._id = id;
            return res.render('products/update', { product: fields, error: error.details });
        }
        try { fields.picture = await myUtil.toBase64(files.picture.path); }
        catch (e) { debug.debug(e.message) }

        Product.updateOne(id, fields)
            .then(r => res.render('products/detail', { product: r }))
            .catch(err => debug.debug(err.message));
    });
}


