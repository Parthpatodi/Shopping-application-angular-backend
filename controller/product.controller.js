const productController = require('../model/product.model');
const moment = require('moment');
const fireBase = require("../middle/fireBase");
const { validationResult } = require('express-validator');
const express = require('express');
const { route } = require('../routes/product.routes');
const {printLogger} = require('../core/utility');
exports.productListSubcategory = (request, response) => {
    try{
        let reqBody = request.params;
        printLogger(2,`product list subcategory: ${JSON.stringify(reqBody)}`);
       
    productController.findOne({ cat_id: request.params.id })
        .then(result => {
            console.log(result);
            printLogger(2,`product List subcategory : ${JSON.stringify(result)}`);
            return response.status(200).json(result);
        })
        .catch(err => {
            console.log(err); 
            printLogger(0,`product List subcategory : ${JSON.stringify(err)}`);
            return response.status(404).json(err);
        });
    }catch(err){
        console.log(result);
        printLogger(2,`product List subcategory: ${JSON.stringify(err)}`);
        return response.status(500).json(err);
    }
}

exports.viewProductDetail = (request,response)=>{
    try{
    productController.findOne({_id : request.params.pid})
       .then((result) => {
           console.log(result);
           printLogger(2,`product List details: ${JSON.stringify(result)}`);
           return response.status(200).json(result);
        })
        .catch((err) => {
           console.log(err);
           printLogger(0,`product List details : ${JSON.stringify(err)}`);
           return response.status(404).json(err);
    });
   }catch(err){
    console.log(err);
    printLogger(4,`product List details : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
   }
}

exports.productList = (request, response) => {
    try{
    productController.find({cat_id: request.params.id}).then(results => {
        console.log(results)
    
        printLogger(2,`product List : ${JSON.stringify(results)}`);
        return response.status(200).json(results);
    }).catch(err => {
        console.log(err);
        printLogger(0,`product List : ${JSON.stringify(err)}`);
        return response.status(404).json(err);
    });
  }catch(err){
    console.log(err);
    printLogger(4,`product List : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
}
}

exports.deleteProduct = (request, response) => {
    try{
    productController.deleteOne({ _id: request.params.id }).then(result => {
        console.log(result);
        printLogger(2,`product delete: ${JSON.stringify(result)}`);
        if (result.deletedCount){
          printLogger(2,`product delete: ${JSON.stringify(result)}`);
            return response.status(202).json({ message: 'deleted successfully' });
         } else{
            printLogger(2,`product delete: ${JSON.stringify(result)}`);
            return response.status(204).json({ message: 'not deleted' })}
    }).catch(err => {
        console.log(err);
        printLogger(0,`product List : ${JSON.stringify(err)}`);
        return response.status(404).json(err);
    })
  }catch(err){
    console.log(err);
    printLogger(4,`product List : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
  }
}

exports.addProduct = (request, response) => {

    console.log(request.body);
    console.log(request.files);
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }
    try{
        let resBody = request.body;
        printLogger(2,`product add: ${JSON.stringify(resBody)}`);
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
        printLogger(2,`product add: ${JSON.stringify(result)}`);
        return response.status(201).json(result);
    }).catch(err => {
        console.log(err);
        printLogger(0,`product add : ${JSON.stringify(err)}`);
        return response.status(403).json(err);
    });
  }catch(err) {
    console.log(err);
    printLogger(4,`product add: ${JSON.stringify(err)}`);
    return response.status(404).json(err);
  }
}
exports.sortPrice = (request, response) => {
    try{
        productController.find({subCategory: request.params.sid}).sort({productPrice:1}).exec(function(err, docs) {
            console.log(docs);
             if(err){
                 
                printLogger(2,`sort Price : ${JSON.stringify(err)}`);
                response.status(200).json(err);
             }
             else{
    
                printLogger(2,`sort Price: ${JSON.stringify(docs)}`);
                response.status(200).json(docs);
             }
        });
      }catch(err){
        console.log(err);
        printLogger(0,`sort price : ${JSON.stringify(err)}`);
        return response.status(404).json(err);
    }
}
exports.sortDatewise = (request, response) => {
    try{
    productController.find({}).sort([
        ['date', 1]
    ]).limit(8).exec(function(err, docs) {
        console.log(docs);
         if(err){
             
            printLogger(2,`sort datewise : ${JSON.stringify(err)}`);
            response.status(200).json(err);
         }
         else{

            printLogger(2,`sort datewise : ${JSON.stringify(docs)}`);
            response.status(200).json(docs);
         }
    });
  }catch(err){
    console.log(err);
    printLogger(0,`sort datewise : ${JSON.stringify(err)}`);
    return response.status(404).json(err);
}
}

exports.updateProduct = (request, response) => {
    try{
        let reqBody = request.body;
        
        printLogger(2,`update product : ${JSON.stringify(reqBody)}`);
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
        printLogger(2,`update product: ${JSON.stringify(result)}`);
        if (result.modifiedCount)
        {
        printLogger(2,`update product : ${JSON.stringify(result.modifiedCount)}`);
            return response.status(200).json({ message: 'updated successfully' });
         } else{
        
        printLogger(2,`update product : ${JSON.stringify(result.modifiedCount)}`);
            return response.status(200).json({ message: 'updated not successfully' });}
    }).catch(err => {
        console.log(err);
        printLogger(0,`update product: ${JSON.stringify(err)}`);
        return response.status(404).json(err);
    });
  }catch(err){
    console.log(err);
    printLogger(4,`update product : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
}

}
exports.byProduct = (request, response) => {
    try{
    productController.find({ subCategory: request.params.sid }).then(result => {
        console.log(result);
        printLogger(2,`subcategory by product: ${JSON.stringify(result)}`);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        printLogger(0,`subcategory by product : ${JSON.stringify(err)}`);
        return response.status(404).json(err);
    });
  }catch(err){
    console.log(err);
    printLogger(4,`subcategory by product : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
}
};