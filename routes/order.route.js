const express = require('express');
const Order = require('../model/order.model');
const Cart = require('../model/cart.model');
const auth = require('../middle/customer.auth');
const { body } = require('express-validator');
const routeCache = require('route-cache');
const router = express.Router();
const {printLogger} = require('../core/utility');
const Razorpay = require("razorpay");


var instance = new Razorpay({ key_id: 'rzp_test_7mhArK6g7mgek0', key_secret: 'Pn50vQs9YfV6fKv2SL8OpqCd' });

router.post('/place-order', body('mobile').not().isEmpty(),
    body('orderList').not().isEmpty(), body('address').not().isEmpty(),
    body('total').not().isEmpty(), auth,async(request, response) => {
        let reqBody = request.body
        try{
           
     printLogger(2, `*********** place order *************${JSON.stringify(reqBody)}`, 'order');
        const { address, mobile, total } = request.body;
        const {userId} = request.user.id;
        const orderItem = { address, mobile, total ,userId};

        var order = new Order(orderItem);
        for (i = 0; i < request.body.orderList.length; i++) {
            var pid = request.body.orderList[i].pId;
            var qty2 = request.body.orderList[i].qty;
            order.orderList.push({ pid: pid, quantity: qty2 });
        }


        order.save()
            .then(result => {
                console.log("order"+result);
                printLogger(2, `*********** place order *************${JSON.stringify(result)}`, 'order');
                return response.status(200).json({ msg: 'order placed' });
            }).catch(err => {
                console.log(err);
                printLogger(0, `*********** place order *************${JSON.stringify(err)}`, 'order');
                return response.status(500).json({ err: 'Server error' });
            });
        }
        catch(error){
            printLogger(4, `CONTROLLER:- punchIn Error:- ${JSON.stringify(error)}`, 'order');
       
        }
    });

router.post("/pay",(req,res)=>{
    try{
        let reqBody = request.body;
        printLogger(2, `*********** payment *************${JSON.stringify(reqBody)}`, 'order');
        instance.orders.create({
            amount: request.body.amount,
            currency: "INR"
          },(err,order)=>{
              if(err){
                printLogger(0, `*********** payment *************${JSON.stringify(err)}`, 'order');
                  console.log(err);
                  res.status(200).json(err);
              }
              else
                 console.log(order);
                 printLogger(2, `*********** place order *************${JSON.stringify(order)}`, 'order');
                 res.status(200).json(order);
          })    
        }catch(err){
            printLogger(4, `*********** payment api *************${JSON.stringify(err)}`, 'order');
            res.status(200).json(err);
        }  
    });

router.post('/payment-status',(req,res)=>{
    try{
        instance.payments.fetch(req.body.razorpay_payment_id).then((result) => {
            console.log(result);
            printLogger(2, `*********** payment *************${JSON.stringify(result)}`, 'order');
            res.send("payment success");
        }).catch((err) => {
            console.log(err);
            printLogger(0, `*********** payment *************${JSON.stringify(err)}`, 'order');
            res.status(404).json(err);
        });
    }catch(err){
        printLogger(4, `*********** payment *************${JSON.stringify(err)}`, 'order');
        res.status(500).json(err);
    }
    });

router.get('/view-order', routeCache.cacheSeconds(20), (request, response) => {
    try{
    Order.find().populate("orderList").populate("pid").then(result => {
        console.log(result);
        printLogger(2, `*********** view order *************${JSON.stringify(result)}`, 'order');
        response.status(200).json(result);
     }).catch(err => {
         console.log(err);
        printLogger(0, `*********** view order *************${JSON.stringify(err)}`, 'order');
        return response.status(404).json({ err: 'Server error' });
    })
     }catch(err){
         console.log(err);
        printLogger(4, `*********** view order *************${JSON.stringify(err)}`, 'order');
    res.status(500).json(order);
}
});
router.get('/p-order/:oid', routeCache.cacheSeconds(20), (request, response) => {
    try{
    Order.findOne({ oid: request.params.oid }).then(result => {
        console.log(result);
        printLogger(2, `*********** order *************${JSON.stringify(result)}`, 'order');
        response.status(200).json(result);
    }).catch(err => {
        printLogger(4, `*********** order *************${JSON.stringify(err)}`, 'order');
        return response.status(500).json({ err: 'Server error' });
    });
}catch(err){
    printLogger(4, `*********** order *************${JSON.stringify(err)}`, 'order');
}
});
router.post('/edit-order/:oid', async(request, response) => {
    console.log(request.body);
    const { address, mobile, shipping, payment } = request.body
    var order = {};

    if (address) {
        order.address = address;
    }
    if (mobile) {
        order.mobile = mobile;
    }
    if (shipping) {
        order.shipping = shipping;
    }
    if (payment) {
        order.payment = payment;
    }
    order = await Order.findOneAndUpdate({ oid: request.params.oid }, { $set: order }, { new: true });
    return response.status(200).json(order);

})
router.get('/sort', routeCache.cacheSeconds(20), (request, response) => {
    try{
        printLogger(2, `*********** sort *************`, 'order');
    Order.find({}).sort([
        ['date', 1]
    ]).exec(function(err, docs) {
        if(docs){
            printLogger(4, `*********** sort *************${JSON.stringify(err)}`, 'order');
        response.status(200).json(docs);
        }else{
            printLogger(2, `*********** sort *************${JSON.stringify(err)}`, 'order');
        response.status(200).json(err);
        }
    });
}catch(err){
    printLogger(0, `*********** sort *************${JSON.stringify(err)}`, 'order');
    response.status(404).json(err);
}
});
router.get('/order-view',auth,(request, response)=>{
    try{
        Order.findOne({ userId: request.user.id }).populate("orderList.pid").then(result => {
            console.log(result);
            printLogger(2, `*********** order *************${JSON.stringify(result)}`, 'order');
            response.status(200).json(result);
        }).catch(err => {
            printLogger(4, `*********** order *************${JSON.stringify(err)}`, 'order');
            return response.status(500).json({ err: 'Server error' });
        });
    }catch(err){
        printLogger(4, `*********** order *************${JSON.stringify(err)}`, 'order');
        return response.status(500).json({ err: 'Server error' });
    }
})
module.exports = router;