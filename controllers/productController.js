const Joi = require('joi');
const formidable = require('formidable');
const fs = require('fs');
const debug = require('debug');

const Product = require('../models/productModel');

exports.get_all = function (req, res) {
    Product.find((err, r) => {
        if (err) {
            debug.debug(err.message);
            throw err;
        }
        res.render('index', { productList: r });
    });
};

exports.get_one = async function (req, res) {
    const { id } = req.params;
    const { error } = validateId(id);
    if (error) {
        return res.status(400).send('Bad request');
    }
    const r = await Product.findById(id);
    if (!r) {
        return res.status(404).send('Product not found');
    }
    res.render('product/productDetail', { product: r });
};

exports.get_one_for_update = async function (req, res) {
    const { id } = req.params;
    const { error } = validateId(id);
    if (error) {
        return res.status(400).send('Bad request');
    }
    const r = await Product.findById(id);
    if (!r) return res.status(400).send('Product not found');
    res.render('product/updateProduct', {product: r});
};
exports.new_product = function (req, res) {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const { error } = validateProduct(fields);
        fields.picture = toBase64(files.picture);
        if (error) {
            res.render('product/newProduct', { product: fields, error: error.details });
            return;
        }
        fields.isForSale = true;
        Product.create(fields).then(r => {
            res.render('product/productDetail', { product: r });
        });
    });
}

exports.update_product = function (req, res) {
    const form = formidable();
    const { id } = req.params;
    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        const { error } = validateProduct(fields);
        fields.picture = toBase64(files.picture);
        if (error) {
            fields._id = id;
            res.render('product/updateProduct', { product: fields, error: error.details });
            return;
        }
        Product.findByIdAndUpdate(id, { $set: fields }, { new: true, lean: true }, (err, r) => {
            if (err) throw err;
            res.render('product/productDetail', { product: r });
        });
    }) 
}

exports.new_product_page = function (req, res) {
    res.render('product/newProduct');
}

function toBase64(file) {
    const picture = fs.readFile(file.path);
    return picture.toString('base64');
}

const productSchema = Joi.object({ 
    seller: Joi.string().min(3).max(30).alphanum().required(),
    name: Joi.string().min(3).max(30).alphanum().required(),
    price: Joi.number().min(1).max(99999).required(),
    quantity: Joi.number().min(1).max(999).required()
});
function validateProduct(product) {
    return productSchema.validate(product, { abortEarly: false });
}

const idSchema = Joi.string().alphanum().hex();
function validateId(id) {
    return idSchema.validate(id);
}