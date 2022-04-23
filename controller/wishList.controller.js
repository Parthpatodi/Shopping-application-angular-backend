const wishList = require('../model/wishList.model');
const { validationResult } = require('express-validator');



exports.addtoWishList = async(request, response) => {
    let errors = validationResult(request);
    if (!errors.isEmpty()) {
        console.log(errors);
        return response.status(400).json({ errors: errors.array() });
    }
    let wish = await wishList.findOne({ userId: request.user.id });
    if (!wish) {
        wish = new wishList();
        wish.userId = request.user.id
    }
    wish.productList.push(request.body.productId);
    wish.save().then(result => {
        return response.status(201).json(result)
    }).catch(
        err => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}
exports.deleteWishList = (request, response) => {
    console.log("delete api call...");
    wishList.deleteOne({userId: request.user.id}).then(result => {
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

exports.viewWish = (request, response) => {
    wishList.findOne({ userId: request.user.id })
        .populate("productList").populate("userId")
        .then(result => {
            return response.status(201).json(result)
        }).catch(error => {
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
}


exports.removeWish = (request, response) => {
    wishList.updateOne({ userId: request.user.id }, {
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