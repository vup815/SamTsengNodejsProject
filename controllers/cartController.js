const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

const memberController = require('../controllers/memberController');

exports.addOne = (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    const productId = req.params.id;
    Product.queryOne(productId)
        .then(r => {
            Cart.addOne(memberId, r)
                .then(() => res.status(200).send('success'));
        })
        .catch(e => { console.log(e) });
}

exports.getAll = (req, res) => {
    if (!req.session.user) return memberController.getLogin(req, res);
    let member = req.session.user;
    Cart.queryAll(member.id)
        .then(r => {
            if (!r) return res.render('cart/myCart', { member: member, products: [] });
            res.render('cart/myCart', { member: member, products: r.products });
        })
        .catch(e => { console.log(e) });
}

exports.deleteOne = (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    const productId = req.params.id;
    Cart.deleteOne(memberId, productId)
        .then(r => res.status(200).send('success'))
        .catch(e => { console.log(e) });
}

exports.ajaxGetAll = (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    Cart.queryAll(memberId)
        .then(r => {
            if (!r) return;
            let productId = r.products.map(v => v._id);
            res.status(200).send(productId);
        })
        .catch(e => { console.log(e) });
}

exports.getCartNum = (req, res) => {
    if (!req.session.user) return;
    const memberId = req.session.user.id;
    Cart.queryAll(memberId)
        .then(r => {
            if (!r) return;
            let num = r.products.length;
            res.send(num.toString());
        })
        .catch(e => { console.log(e) });
}

exports.buyAgain = async (req, res) => {
    try {
        const { orderId } = req.params;
        let member = req.session.user;
        let promises = [];
        let order = await Order.queryOne(orderId);
        let orderDetail = order.orderDetail;
        for (let i = 0; i < orderDetail.length; i++) {
            let promise = new Promise(resolve => {
                Product.queryOne(orderDetail[i].id)
                    .then(r => resolve(r))
                    .catch(e => { throw new Error(e.message) });
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
            .catch(e => { throw new Error(e.message) });

        Promise.all(promises)
            .then(r => res.render('cart/myCart', { member: member, products: r }))
            .catch(e => { throw new Error(e.message) });

    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}
