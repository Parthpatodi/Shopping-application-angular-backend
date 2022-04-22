const cartmodel = require('../model/cart.model');
const { validationResult } = require('express-validator');

exports.addtoCart = async(request, response) => {
    let errors = validationResult(request);
     
    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }
    let cart = await cartmodel.findOne({ userId: request.user.id });
    if (!cart) {
        cart = new cartmodel();
        cart.userId = request.user.id
    }
    cart.productList.push(request.body.productId);
    cart.save().then(result => {
        console.log(result);
        return response.status(201).json(result)
    }).catch(
        err => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.viewCart = (request, response) => {
    cartmodel.findOne({ userId: request.user.id })
        .populate("productList").populate("userId")
        .then(result => {
            return response.status(201).json(result)
        }).catch(error => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}

exports.deleteCart = (request, response) => {
    cartmodel.deleteOne({userId: request.user.id}).then(result => {
        console.log(result);
        if(result.deletedCount)
        return response.status(200).json({msg:"success"});

        else
        return response.status(200).json({msg:"failed to delete"});

    }).catch(err=>{
        console.log(err);
        return response.status(500).json({err:err.array});
    });
}
exports.delCart = (request, response) => {
    cartmodel.updateOne({ userId: request.user.id }, { 
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