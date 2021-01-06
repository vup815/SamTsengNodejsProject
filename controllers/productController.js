
const Product = require('../models/productModel');
const { validateProduct, validateId } = require('../services/validation');

exports.getAll = (req, res) => {
    try {
        let member = req.session.user;
        let { type } = req.params;
        Product.queryAll(type)
            .then(r => res.render('product/all', { member: member, products: r }))
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}


exports.adminAll = (req, res) => {
    try {
        Product.queryAll()
            .then(r => res.render('product/adminAll', { products: r }))
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.getOne = async function (req, res) {
    try {
        let member = req.session.user;
        const { id } = req.params;
        const { error } = validateId(id);
        if (error) return res.status(400).send('Bad request');
        const isUpdate = (req.query.update === '1') ? true : false
        Product.queryOne(id)
            .then(r => {
                if (!r) return res.status(404).send('Product not found !');
                if (isUpdate) return res.render('product/update', { product: r, error: [] });
                res.render('product/detail', { member: member, product: r });
            })
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.createOne = function (req, res) {
    try {
        let body = req.body;
        const { error } = validateProduct(body);
        if (error) return res.render('product/new', { product: body, error: error.details });

        let productData = {
            name: body.name,
            price: body.price,
            quantity: body.quantity,
            isForSale: true
        }
        let file = req.file;
        if (file && file.size > 0) {
            productData.picture = file.buffer.toString('base64');
        }
        Product.createOne(productData)
            .then(() => {
                Product.queryAll().then(r => res.render('product/adminAll', { products: r }))
            })
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.updateOne = function (req, res) {
    try {
        const body = req.body;
        const { id } = req.params;
        const { error } = validateProduct(body);
        if (error) {
            body._id = id;
            return res.render('product/update', { product: body, error: error.details });
        }
        let productData = {
            name: body.name,
            price: body.price,
            quantity: body.quantity
        }
        let file = req.file;
        if (file && file.size > 0) {
            productData.picture = file.buffer.toString('base64');
        }
        Product.updateOne(id, productData)
            .then(Product.queryAll().then(r => res.render('product/adminAll', { products: r })))
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.toggleOnSale = async function (req, res) {
    try {
        const { id } = req.params;
        Product.queryOne(id)
            .then(r => {
                let onSale = (r.isForSale) ? false : true;
                r.isForSale = onSale;
                Product.updateOne(id, r);
                res.status(200).send('success');
            })
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}