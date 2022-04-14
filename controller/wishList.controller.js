const wishList = require('../model/wishList.model');
const { validationResult } = require('express-validator');



exports.addtoWishList = async(request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }
    let wish = await wishList.findOne({ userId: request.body.userId });
    if (!wish) {
        wish = new wishList();
        wish.userId = request.body.userId
    }
    wish.productList.push(request.body.productId);
    wish.save().then(result => {
        return response.status(201).json(result)
    }).catch(
        err => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.viewWish = (request, response) => {
    wishList.findOne({ userId: request.params.userId })
        .populate("productList").populate("userId")
        .then(result => {
            return response.status(201).json(result)
        }).catch(error => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.removeWish = (request, response) => {
    wishList.updateOne({ userId: request.body.userId }, {
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