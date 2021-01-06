const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');

exports.getAll = (req, res) => {
    try {
        let { type, status } = req.params;
        let member = req.session.user;
        if (type === 'admin') {
            Order.queryAll(status)
                .then(r => res.render('order/adminAll', { orders: r, status: status }))
                .catch(e => { throw new Error(e.message) });
        }
        if (type === 'customer') {
            Order.queryAllById(member.id, status)
                .then(r => res.render('order/all', { member: member, orders: r, status: status }))
                .catch(e => { throw new Error(e.message) });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }

}

exports.getLatest = (req, res) => {
    try {
        if (!req.session.user) return;
        let member = req.session.user;
        Order.getLatest(member.id)
            .then(r => res.render('order/check', { order: r[0], member: member }))
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.createOne = async (req, res) => {
    try {
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
            .catch(e => { throw new Error(e.message) });

        Cart.deleteAll(req.session.user.id);
        res.status(200).send('success');
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

exports.modifyStatus = (req, res) => {
    try {
        let orderId = req.params.id;
        let { statusToChange } = req.body;

        Order.changeStatus(orderId, statusToChange)
            .then(() => res.status(200).send('success'))
            .catch(e => { throw new Error(e.message) });
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}