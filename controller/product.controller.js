//const express=require('express');
const productController = require('../model/product.model');

const { validationResult } = require('express-validator');
const express = require('express');

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
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }

    const productImageFront = "";
    const productImageBack = "";
    const productImageLeft = "";
    const productImageRight = "";

    productController.create({
        productName: request.body.productName,
        productImageFront: "http://localhost:3000/images/" + request.files[0].filename,
        productImageBack: "http://localhost:3000/images/" + request.files[1].filename,
        productImageLeft: "http://localhost:3000/images/" + request.files[2].filename,
        productImageRight: "http://localhost:3000/images/" + request.files[3].filename,
        productQty: request.body.productQty,
        productPrice: request.body.productPrice,
        productDescription: request.body.productDescription,
        subCategoryId: request.body.categoryId
    }).then(result => {
        console.log(result);
        return response.status(201).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(403).json(err);
    });
}

exports.updateProduct = (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors })

    productController.updateOne({ _id: request.body.productId }, {
        $set: {
            productName: request.body.productName,
            productImageFront: "http://localhost:3000/images/" + request.files[0].filename,
            productImageBack: "http://localhost:3000/images/" + request.files[1].filename,
            productImageLeft: "http://localhost:3000/images/" + request.files[2].filename,
            productImageRight: "http://localhost:3000/images/" + request.files[3].filename,
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