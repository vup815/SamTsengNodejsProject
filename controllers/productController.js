
const Product = require('../models/productModel');
const { validateProduct, validateId } = require('../services/validation');

exports.getAll = (req, res) => {
    let member = req.session.user;
    let { type } = req.params;
    Product.queryAll(type)
        .then(r => res.render('product/all', { member: member, products: r }))
        .catch(e => { console.log(e) });
}


exports.adminAll = (req, res) => {
    Product.queryAll()
        .then(r => res.render('product/adminAll', { products: r }))
        .catch(e => { console.log(e) });
}

exports.getOne = function (req, res) {
    let member = req.session.user;
    const { id: productId } = req.params;
    const { error } = validateId(productId);
    if (error) return res.status(400).send('Bad request');
    const isUpdate = (req.query.update === '1') ? true : false
    Product.queryOne(productId)
        .then(r => {
            if (!r) return res.status(404).send('Product not found !');
            if (isUpdate) return res.render('product/update', { product: r, error: [] });
            res.render('product/detail', { member: member, product: r });
        })
        .catch(e => { console.log(e) });
}

exports.createOne = function (req, res) {
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
        .catch(e => { console.log(e) });
}

exports.updateOne = function (req, res) {
    const body = req.body;
    const { id: productId } = req.params;
    const { error } = validateProduct(body);
    if (error) {
        body._id = productId;
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
    Product.updateOne(productId, productData)
        .then(()=>{
            Product.queryAll().then(r => res.render('product/adminAll', { products: r }))
        })
        .catch(e => { console.log(e) });
}

exports.toggleOnSale = function (req, res) {
    const { id: productId } = req.params;
    Product.queryOne(productId)
        .then(r => {
            let onSale = (r.isForSale) ? false : true;
            r.isForSale = onSale;
            Product.updateOne(productId, r);
            res.status(200).send('success');
        })
        .catch(e => { console.log(e) });
} 
