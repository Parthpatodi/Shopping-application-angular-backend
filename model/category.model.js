const mongoose = require('mongoose');
const Schema = mongoose.schema;
const CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("categories", CategorySchema);