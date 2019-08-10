const mongoose = require('mongoose');
const moment = require('moment');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    product_image:{
        type:String,
        required: true
    },
    created_at:{
        type: String,
        default: moment().format('dddd MMMM Do YYYY, h:mm:ss a')
    }
});
module.exports = mongoose.model('Product', productSchema);