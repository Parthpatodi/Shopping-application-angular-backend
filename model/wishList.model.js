const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const wishSchema = new mongoose.Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },

    productList: [{
        type: Schema.Types.ObjectId,
        ref: "products"
    }],
}, { timestamps: true });

module.exports = mongoose.model("wishLists", wishSchema);