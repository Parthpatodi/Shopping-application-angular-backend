const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

    userId: String,
    orderList: [{
        pid: String,
        quantity: String,
        date: {
            type: Date,
            default: Date.now
        }
    }],
    total: String,
    address: String,
    mobile: String,
    shipping: String,
    payment: String,
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("orders", orderSchema);