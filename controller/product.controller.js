const productController = require('../model/product.model');
const moment = require('moment');
const fireBase = require("../middle/fireBase");
const { validationResult } = require('express-validator');
const express = require('express');
const { route } = require('../routes/product.routes');

exports.productListSubcategory = (request, response) => {
    productController.findOne({ cat_id: request.params.id })
        .then(result => {
            console.log(result);
            return response.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return response.status(404).json(err);
        });
}

exports.viewProductDetail = (request,response)=>{
    productController.findOne({_id : request.params.pid})
       .then((result) => {
           console.log(result);
           return responses.status(200).json(result);
        })
        .catch((err) => {
           console.log(err);
           return response.status(404).json(err);
    });
}

exports.productList = (request, response) => {
    productController.find().then(results => {
        console.log(results)
        return response.status(200).json(results);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: "Opps ! Something went wrong" });
    });
}

exports.deleteProduct = (request, response) => {
    productController.deleteOne({ _id: request.params.id }).then(result => {
        console.log(result);
        if (result.deletedCount)
            return response.status(202).json({ message: 'deleted successfully' });
        else
            return response.status(204).json({ message: 'not deleted' })
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: 'Opps!Something went wrong' });
    })
}

exports.addProduct = (request, response) => {
    console.log(request.body);
    console.log(request.files);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }

    const productImageFront = "";
    const productImageBack = "";
    const productImageLeft = "";
    const productImageRight = "";
    var date = moment().format('LLLL')
    console.log(date);

    productController.create({
        productName: request.body.productName,
        productImageFront: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
        productImageBack: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[1].filename + "?alt=media&token=abcddcba",
        productImageLeft: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[2].filename + "?alt=media&token=abcddcba",
        productImageRight: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[3].filename + "?alt=media&token=abcddcba",
        productQty: request.body.productQty,
        productPrice: request.body.productPrice,
        productDescription: request.body.productDescription,
        subCategory: request.body.categoryId,
        date: date
    }).then(result => {
        console.log(result);
        return response.status(201).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(403).json(err);
    });
}

exports.sortDatewise = (request, response) => {
    Product.find({}).sort([
        ['date', -1]
    ]).exec(function(err, docs) {
        console.log(docs);
        console.log(err);
        response.status(200).json(docs);
    });

}

exports.updateProduct = (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors })

    productController.updateOne({ _id: request.params.pid }, {
        $set: {
            productName: request.body.productName,
            productImageFront: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
            productImageBack: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[1].filename + "?alt=media&token=abcddcba",
            productImageLeft: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[2].filename + "?alt=media&token=abcddcba",
            productImageRight: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[3].filename + "?alt=media&token=abcddcba",
            productQty: request.body.productQty * 1,
            productPrice: request.body.productPrice * 1,
            productDescription: request.body.productDescription
        }
    }).then(result => {
        console.log(result);
        if (result.modifiedCount)
            return response.status(200).json({ message: 'updated successfully' });
        else
            return response.status(404).json({ message: 'updated not successfully' });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: 'Opps!Something went wrong' });
    });

}
exports.byProduct = (request, response) => {
    productController.find({ subCategoryId: request.params.sid }).then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ status: 'failed' });
    });
};