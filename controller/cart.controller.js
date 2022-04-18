const cartmodel = require('../model/cart.model');
const { validationResult } = require('express-validator');

exports.addtoCart = async(request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }
    let cart = await cartmodel.findOne({ userId: request.body.userId });
    if (!cart) {
        cart = new cartmodel();
        cart.userId = request.body.userId
    }
    cart.productList.push(request.body.productId);
    cart.save().then(result => {
        return response.status(201).json(result)
    }).catch(
        err => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.viewCart = (request, response) => {
    cartmodel.findOne({ userId: request.params.userId })
        .populate("productList").populate("userId")
        .then(result => {
            return response.status(201).json(result)
        }).catch(error => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.delCart = (request, response) => {
    cartmodel.updateOne({ userId: request.body.userId }, {
            $pullAll: {
                productList: [{
                    _id: request.body.productId
                }]
            } 
        })
        .then(result => {
            return response.status(202).json({ message: 'Deleted successfully' });
        }).catch(error => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })


}