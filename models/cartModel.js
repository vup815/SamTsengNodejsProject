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

exports.queryAll = (memberId) => {
    return new Promise((resolve, reject) => {
        Cart.findOne({ buyer: memberId }, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
}


exports.addOne = async (memberId, product) => {
    let cart = await Cart.findOne({ buyer: memberId }, (err, res) => {
        if (err) throw err;
        return res;
    });
    if (!cart) cart = new Cart({products: [], buyer: memberId});
    let innerProduct = cart.products.find(v => v._id.toString() === product._id.toString());
    if (!innerProduct) cart.products.push(product);
    try { return await cart.save(); } 
    catch (e) {debug.debug(e.message)}
}

exports.deleteOne = (memberId, productId) => {
    return new Promise((resolve, reject) => {
        let cart = Cart.findOne({ buyer: memberId });
        let product = cart.products.id(productId);
        product.remove();
        cart = cart.save();
        resolve(cart);
    })
}
exports.deleteAll = () => {

}