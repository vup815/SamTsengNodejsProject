const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const debug = require('debug');
exports.addOne = async (req, res) => {
    const memberId = req.session.user.id;
    const prodId = req.params.id;
    try {
        const product = await Product.queryOne(prodId);
        let cart = await Cart.addOne(memberId, product);
        res.json({ result: cart });
    }
    catch (e) { debug.debug(e.message); }
}