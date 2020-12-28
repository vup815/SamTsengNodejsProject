const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    buyer: String,
    total: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['ordered', 'shipped', 'finished', 'canceled']
    },
    orderDetail: [
        new mongoose.Schema({
            name: String,
            price: Number,
            amount: Number,
            picture: String
        })
    ]
});

const Order = mongoose.model('Order', OrderSchema);

exports.getLatest = (memberId) => {
    return new Promise((resolve, reject) => {
        Order.find({ buyer: memberId })
            .sort('-orderDate')
            .limit(1)
            .exec((err, r) => {
                if (err) reject(err);
                resolve(r);
            });
    });
}




exports.queryAll = (memberId, status) => {
    return new Promise((resolve, reject) => {
        if (status === 'all') {
            Order.find({ buyer: memberId })
                .sort('-orderDate')
                .exec((err, r) => {
                    if (err) reject(err);
                    resolve(r);
                });
        } else {
            Order.find({ buyer: memberId })
                .where({ status: status })
                .sort('-orderDate')
                .exec((err, r) => {
                    if (err) reject(err);
                    resolve(r);
                });
        }
    });
}

exports.createOne = (data) => {
    // return new Promise((resolve, reject) => {
    //     let order = new Order(data);
    //     order.save(function (err, result) {
    //         if (err) reject(err);
    //         resolve(result);
    //     })
    // })
    let order = new Order(data);
    order.save();
}

exports.changeStatus = async (orderId, status) => {
    let order = await Order.findById(orderId);
    order.status = status;
    return new Promise((resolve, reject) => {
        order.save(function (err, result) {
            if (err) reject(err);
            resolve(result);
        })
    })
}