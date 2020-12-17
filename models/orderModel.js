const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    products:[{type: Schema.Types.ObjectId, ref: 'Product'}],
    total: {
        type: Number,
        required: true,
        min:1
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        enum: ['normal', 'canceled', 'shiped', 'finished'],
        default: 'normal'
    }
})