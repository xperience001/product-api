const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = mongoose.Schema({
    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true},
        
    quantity: {
        type: Number,
        default: 1
    },
    ordered_at: {
        type: String,
        default: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
    }
});

module.exports = mongoose.model('Order', orderSchema);