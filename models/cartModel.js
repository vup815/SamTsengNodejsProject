const mongoose = require('mongoose');
const { ProductSchema } = require('./productModel');
const debug = require('debug');

const CartSchema = new mongoose.Schema({
    products: {
        type: [ProductSchema]
    },
    buyer: String
});

const Cart = mongoose.model('Cart', CartSchema);

exports.queryAll = async (memberId) => {
    let cart = await Cart.findOne({ buyer: memberId }, (err, res) => {
        if (err) throw err;
        return res;
    });
    if (!cart) cart = new Cart({ products: [], buyer: memberId });
    return cart;
}


exports.addOne = async (memberId, product) => {
    let cart = await Cart.findOne({ buyer: memberId }, (err, res) => {
        if (err) throw err;
        return res;
    });
   
    if (!cart) cart = new Cart({ products: [], buyer: memberId });
    let innerProduct = cart.products.find(v => v._id.toString() === product._id.toString());
    if (!innerProduct) cart.products.push(product);
    return new Promise((resolve, reject) => {
        cart.save(function (err, result) {
            if (err) reject (err);
            resolve(result);
        })
    })
}

exports.deleteOne = async (memberId, productId) => {
    let cart = await Cart.findOne({ buyer: memberId }, (err, res) => {
        if (err) throw err;
        return res;
    });
    cart.products.id(productId).remove();
    return new Promise((resolve, reject) => {
        cart.save(function (err, result) {
            if (err) reject (err);
            resolve(result);
        })
    })
}
