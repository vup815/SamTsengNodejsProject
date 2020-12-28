const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

const formidable = require('formidable');
exports.getAll = async (req, res) => {
    if (!req.session.user) return;
    let memberId = req.session.user.id;
    let status = req.params.status;
    try {
        let result = await Order.queryAll(memberId, status);
        res.render('order/all', { orders: result, status: status });
    } catch (e) { console.log(e); }
}

exports.getLatest = async (req, res) => {
    if (!req.session.user) return;
    let member = req.session.user;
    try {
        let result = await Order.getLatest(member.id);
        res.render('order/check', { order: result[0], member: member });
    } catch (e) { console.log(e); }
}


exports.createOne = async (req, res) => {
    let carts = JSON.parse(req.body.carts);
    let promises = [];
    for (let i = 0; i < carts.length; i++) {
        let cart = carts[i];
        let promise = new Promise((resolve) => {
            Product.queryOne(cart.id)
                .then(r => {
                    let order = {};
                    order.name = r.name;
                    order.price = r.price;
                    order.picture = r.picture;
                    order.amount = cart.amount;
                    resolve(order);
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
        .catch(e => { console.log(e); });

    Cart.deleteAll(req.session.user.id);    
}

exports.modify = async (req, res) => {
    let orderId = req.params.id;
    let statusToChange = req.body.statusToChange;
    try {
        Order.changeStatus(orderId, statusToChange);
    } catch (e) {
        console.log(e);
    }
}