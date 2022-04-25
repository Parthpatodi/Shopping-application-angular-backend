const wishList = require('../model/wishList.model');
const { validationResult } = require('express-validator');



exports.addtoWishList = async(request, response) => {
    try{
        let reqBody = request.body;
    printLogger(2,`add wishlist : ${JSON.stringify(reqBody)}`);
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
        
    printLogger(2,`add wishlist : ${JSON.stringify(result)}`);
        return response.status(201).json(result)
    }).catch(
        err => {
    printLogger(0,`add wishlist : ${JSON.stringify(err)}`);
            return response.status(404).json({ message: 'Oops! Something went wrong' });
        })
    }catch(err){ 
    printLogger(4,`add wishlist : ${JSON.stringify(err)}`);
    return response.status(500).json({ message: 'Oops! Something went wrong' });
    }
}
exports.deleteWishList = (request, response) => {
    try{
    console.log("delete api call...");
    wishList.deleteOne({userId: request.user.id}).then(result => {
        console.log(result);
        
    printLogger(2,`delete wish : ${JSON.stringify(result)}`);
        if(result.deletedCount){
            
    printLogger(2,`delete wish : ${JSON.stringify(result.deletedCount)}`);
        return response.status(200).json({msg:"success"});
        }
        else{      
       printLogger(2,`delete wish : ${JSON.stringify(result.deletedCount)}`);
        return response.status(200).json({msg:"failed to delete"});
        }
    }).catch(err=>{
        console.log(err);
       printLogger(0,`delete wish : ${JSON.stringify(err)}`);
        return response.status(404).json({err:err.array});
    });
}catch(err){
    printLogger(4,`delete cart : ${JSON.stringify(err)}`);
}
}

exports.viewWish = (request, response) => {
    try{
    wishList.findOne({ userId: request.user.id })
        .populate("productList")
        .then(result => {
            printLogger(2,`view wish : ${JSON.stringify(result)}`);
            return response.status(200).json(result)
        }).catch(error => {
            printLogger(0,`view wish : ${JSON.stringify(error)}`);
            return response.status(404).json({ message: 'Oops! Something went wrong' });
        })
    }catch(err){
    printLogger(4,`view wishList : ${JSON.stringify(err)}`);
    return response.status(500).json({ message: 'Oops! Something went wrong' });
    }
}


exports.removeWish = (request, response) => {
    try{
    wishList.updateOne({ userId: request.user.id }, {
            $pullAll: {
                productList: [{
                    _id: request.body.productId
                }]
            }
        })
        .then(result => {
            printLogger(2,`remove wish : ${JSON.stringify(result)}`);
            return response.status(202).json({ message: 'Deleted successfully' });
        }).catch(error => {
            printLogger(0,`remove wish : ${JSON.stringify(error)}`);
            return response.status(500).json({ message: 'Oops! Something went wrong' });
        })
    }catch(err){
    printLogger(4,`delete cart : ${JSON.stringify(err)}`);
    }

}