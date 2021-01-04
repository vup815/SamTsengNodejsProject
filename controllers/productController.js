const formidable = require('formidable');
const debug = require('debug');

const Product = require('../models/productModel');
const validation = require('../services/validation');
const myUtil = require('../utils/util');

exports.getAll = (req, res) => {
    let member = req.session.user;
    let { type } = req.params;
    try {
        Product.queryAll(type)
            .then(r => res.render('product/all', { member: member, products: r }))
            .catch(err => debug.debug(err.message));

    } catch (e) { debug.debug(e.message); }
}


exports.adminAll = (req, res) => {
    Product.queryAll()
        .then(r => res.render('product/adminAll', { products: r }))
        .catch(err => debug.debug(err.message));
}

exports.getOne = async function (req, res) {
    let member = req.session.user;
    const { id } = req.params;
    const { error } = validation.validateId(id);
    if (error) return res.status(400).send('Bad request');
    const isUpdate = (req.query.update === '1') ? true : false
    Product.queryOne(id)
        .then(r => {
            if (!r) return res.status(404).send('Product not found !');
            if (isUpdate) return res.render('product/update', { product: r, error: [] });
            res.render('product/detail', { member: member, product: r });
        })
        .catch(err => debug.debug(err.message));
}

exports.createOne = function (req, res) {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        if (err) throw err;
        const { error } = validation.validateProduct(fields);
        if (error) return res.render('product/new', { product: fields, error: error.details });
        try { fields.picture = await myUtil.toBase64(files.picture.path); }
        catch (e) { debug.debug(e.message); }

        fields.isForSale = true;
        Product.createOne(fields)
            .then(r => res.render('product/detail', { product: r }))
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
            return res.render('product/update', { product: fields, error: error.details });
        }
        if (files.picture.size > 0) {
            try { fields.picture = await myUtil.toBase64(files.picture.path); }
            catch (e) { debug.debug(e.message) }
        }
        Product.updateOne(id, fields)
            .then(
                Product.queryAll().then(r => res.render('product/adminAll', { products: r }))
            )
    });
}

exports.toggleOnSale = async function (req, res) {
    const { id } = req.params;
    let product = await Product.queryOne(id);
    let onSale = (product.isForSale) ? false : true;
    product.isForSale = onSale;
    Product.updateOne(id, product);
    res.send('ok');
}