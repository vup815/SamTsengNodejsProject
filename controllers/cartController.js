const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const debug = require('debug');

const memberController = require('../controllers/memberController');

exports.addOne = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    const memberId = req.session.user.id;
    const prodId = req.params.id;
    try {
        const product = await Product.queryOne(prodId);
        Cart.addOne(memberId, product)
            .then(r => res.json({result: r}));
    }
    catch (e) { debug.debug(e.message); }
}

exports.getAll = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    const memberId = req.session.user.id;
    
    try {
        let cart = await Cart.queryAll(memberId);
        res.render('cart/myCart', {products: cart.products});
    } catch (e) {console.log(e)}
   
}


exports.deleteOne = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    const memberId = req.session.user.id;
    const productId = req.params.id;
    try {
        Cart.deleteOne(memberId, productId)
            .then(r => res.json({result: r}));
    }
    catch (e) { debug.debug(e.message); }
}

exports.ajaxGetAll = async (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    try {
        let cart = await Cart.queryAll(memberId);
        let productId = cart.products.map(v => v._id);
        res.send(productId);
    } catch (e) { debug.debug(e.message); }
}

exports.getCartNum = async (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    try {
        let cart = await Cart.queryAll(memberId);
        let num = cart.products.length;
        res.send(num.toString());
    }
    catch (e) { debug.debug(e.message); }
}