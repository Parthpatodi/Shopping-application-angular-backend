const cartmodel = require('../model/cart.model');
const { validationResult } = require('express-validator');
const {printLogger} = require('../core/utility');
exports.addtoCart = async(request, response) => {
    try{
        let reqBody = request.body;
        printLogger(0,`add cart : ${JSON.stringify(reqBody)}`);
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
        printLogger(2,`add cart : ${JSON.stringify(result)}`);
        return response.status(200).json(result)
    }).catch(
        err => {
            printLogger(0,`add cart : ${JSON.stringify(err)}`);
            return response.status(404).json({ message: 'Oops! Something went wrong' });
        })
    }catch(err) {
        printLogger(4,`add cart : ${JSON.stringify(err)}`);
        return response.status(500).json(err);
    }
}


exports.viewCart = (request, response) => {
    try{
    cartmodel.findOne({ userId: request.user.id })
        .populate("productList").populate("userId")
        .then(result => {
            printLogger(2,`view cart : ${JSON.stringify(result)}`);
            return response.status(201).json(result)
        }).catch(error => {
            printLogger(0,`view cart : ${JSON.stringify(err)}`);
            return response.status(404).json({ message: 'Oops! Something went wrong' });
        })
    }catch(err){
        printLogger(4,`view cart : ${JSON.stringify(err)}`);
        return response.status(500).json(err);
    }
}


exports.deleteCart = (request, response) => {
    try{
    cartmodel.deleteOne({userId: request.user.id}).then(result => {
        console.log(result);
        
        if(result.deletedCount){
            printLogger(2,`delete cart : ${JSON.stringify(result.deletedCount)}`);
        return response.status(200).json({msg:"success"});
        }
        else{
            printLogger(2,`delete cart : ${JSON.stringify(result.deletedCount)}`);
        return response.status(200).json({msg:"failed to delete"});
        }
    }).catch(err=>{
        console.log(err);
        printLogger(0,`delete cart : ${JSON.stringify(result)}`);
        return response.status(404).json(err);
    });
  }catch(err){
    printLogger(4,`delete cart : ${JSON.stringify(err)}`);
    return response.status(500).json(err);
  }

}
exports.delCart = (request, response) => {
    try{
    cartmodel.updateOne({ userId: request.user.id }, { 
            $pullAll: {
                productList: [{
                    _id: request.body.productId 
                }]
            } 
        })
        .then(result => {         
           printLogger(2,`delete cart product : ${JSON.stringify(result)}`);
            return response.status(202).json({ message: 'Deleted successfully' });
        }).catch(error => {
           printLogger(0,`delete cart product: ${JSON.stringify(error)}`);
            return response.status(404).json({ message: 'Oops! Something went wrong' });
        })

    }
    catch(err){
        
    printLogger(4,`delete cart product : ${JSON.stringify(err)}`);
        return response.status(500).json(err);
    }
}