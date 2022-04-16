const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true,
        default: 0
    },
    productImageFront: {
        type: String,
        required: true
    },
    productImageBack: {
        type: String,
        required: true
    },
    productImageLeft: {
        type: String,
        required: true
    },
    productImageRight: {
        type: String,
        required: true
    },
    productQty: {
        type: Number,
        default: 1
    },
    productDescription: {
        type: String,

    },
    isavailable: {
        type: Boolean,
        default: true
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: "subCatagory"
    },
    date: {
        type: String
    }
});

module.exports = mongoose.model('products', productSchema);