const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const debug = require('debug');

const memberController = require('../controllers/memberController');

exports.addOne = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    const memberId = req.session.user.id;
    const prodId = req.params.id;
    try {
        const product = await Product.queryOne(prodId);
        Cart.addOne(memberId, product)
            .then(r => res.json({ result: r }));
    }
    catch (e) { debug.debug(e.message); }
}

exports.getAll = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    let member = req.session.user;
    try {
        let cart = await Cart.queryAll(member.id);
        res.render('cart/myCart', { member: member, products: cart.products });
    } catch (e) { debug.debug(e.message) }

}


exports.deleteOne = async (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    const memberId = req.session.user.id;
    const productId = req.params.id;
    try {
        Cart.deleteOne(memberId, productId)
            .then(r => res.json({ result: r }));
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

exports.buyAgain = async (req, res) => {
    const { orderId } = req.params;
    let member = req.session.user;
    let promises = [];
    let order = await Order.queryOne(orderId);
    let orderDetail = order.orderDetail;
    for (let i = 0; i < orderDetail.length; i++) {
        let promise = new Promise(resolve => {
            Product.queryOne(orderDetail[i].id)
                .then(r => resolve(r));
        });
        promises.push(promise);
    }
    Promise.all(promises)
        .then(r => {
            promises.length = 0;
            for (let i = 0; i < r.length; i++) {
                let product = r[i];
                let promise = Cart.addOne(member.id, product);
                promises.push(promise);
            }
        })
        .catch(err => debug.debug(err.message));

    Promise.all(promises)
        .then(r => res.render('cart/myCart', { member: member, products: r }))
        .catch(e => debug.debug(e.message));
    }
    