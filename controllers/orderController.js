const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const debug = require('debug');
const formidable = require('formidable');
exports.getAll = async (req, res) => {
    let {type, status} = req.params;
    let member = req.session.user;
    if (type === 'admin') {
        Order.queryAll(status)
            .then(r => res.render('order/adminAll', {orders : r, status: status}))
    }
    if (type === 'customer') {
        Order.queryAllById(member.id, status)
            .then(r => res.render('order/all', {member: member, orders: r, status: status}));
    }
}

exports.getLatest = async (req, res) => {
    if (!req.session.user) return;
    let member = req.session.user;
    try {
        let result = await Order.getLatest(member.id);
        res.render('order/check', { order: result[0], member: member });
    } catch (e) { debug.debug(e.message); }
}


exports.createOne = async (req, res) => {
    let carts = JSON.parse(req.body.carts);
    let promises = [];
    for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];
        let promise = new Promise((resolve) => {
            Product.queryOne(cart.id)
                .then(r => {
                    let detail = {};
                    detail.name = r.name;
                    detail.price = r.price;
                    detail.picture = r.picture;
                    detail.amount = cart.amount;
                    detail.id = r._id;
                    resolve(detail);
                });
        });
        promises.push(promise);
    }

    Promise.all(promises)
        .then(results => {
            let total = results.reduce((acc, v) => acc + v.price * v.amount, 0);
            let order = {
                buyer: req.session.user.id,
                total: total,
                status: 'ordered',
                orderDetail: results
            };
            Order.createOne(order);
        })
        .catch(e => { debug.debug(e.message); });

    Cart.deleteAll(req.session.user.id);    
}

exports.modify = async (req, res) => {
    let orderId = req.params.id;
    let {statusToChange} = req.body;
    try {
        Order.changeStatus(orderId, statusToChange);
    } catch (e) {
        debug.debug(e.message);
    }
}