const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 999999,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
        max: 999
    },
    onSaleTime: {
        type: Date,
        default: Date.now()
    },
    picture: String,
    isForSale: Boolean
});
exports.ProductSchema = ProductSchema;
const Product = mongoose.model('Product', ProductSchema);

exports.queryAll = (type) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .sort(type)
            .exec((err, r) => {
                if (err) reject (err);
                resolve(r);
            });
    });
}
exports.queryOne = id => {
    return new Promise((resolve, reject) => {
        Product.findById(id, (err, res) => {
            if (err) reject(err);
            resolve(res);
        })
    })
}

exports.createOne = data => Product.create(data);
    
exports.updateOne = (id, data) => {
    return new Promise((resolve, reject) => {
        Product.findByIdAndUpdate(id, { $set: data }, { new: true, lean: true }, (err, r) => {
            if (err) reject(err);
            resolve(r);
        });
    })
}