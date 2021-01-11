const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

exports.getAll = (req, res) => {
    let { role, status } = req.params;
    let member = req.session.user;
    if (role === 'admin') {
        Order.queryAll(status)
            .then(r => res.render('order/adminAll', { orders: r, status: status }))
            .catch(e => { console.log(e) });
    }
    if (role === 'customer') {
        Order.queryAllById(member.id, status)
            .then(r => res.render('order/all', { member: member, orders: r, status: status }))
            .catch(e => { console.log(e) });
    }
}

exports.getLatest = (req, res) => {
    if (!req.session.user) return;
    let member = req.session.user;
    Order.getLatest(member.id)
        .then(r => res.render('order/check', { order: r[0], member: member }))
        .catch(e => { console.log(e) });
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
        .catch(e => { console.log(e) });

    Cart.deleteAll(req.session.user.id)
        .then(r => res.status(200).send(r))
        .catch(e => console.log(e));
}

exports.modifyStatus = (req, res) => {
    let orderId = req.params.id;
    let { statusToChange } = req.body;

    Order.changeStatus(orderId, statusToChange)
        .then(() => res.status(200).send('success'))
        .catch(e => { console.log(e) });
} 
