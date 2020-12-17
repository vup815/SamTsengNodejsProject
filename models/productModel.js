const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    seller: {
        // type: Schema.Types.ObjectId,
        // ref: 'Member'
        type: String
    },
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
    picture:String,
    isForSale: Boolean
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;