const express = require('express');
const Order = require('../model/order.model');
const Cart = require('../model/cart.model');
const auth = require('../middle/customer.auth');
const { body } = require('express-validator');
const routeCache = require('route-cache');
const router = express.Router();
const Razorpay = require("razorpay");

// var instance = new Razorpay({ key_id: 'rzp_test_7mhArK6g7mgek0', key_secret: 'Pn50vQs9YfV6fKv2SL8OpqCd' });
var instance = new Razorpay({ key_id: 'rzp_test_MqoJug1nXNqVws', 
key_secret: 'YHoby3Skm0FCRLhnjokcit1Z' })

router.post('/place-order', body('mobile').not().isEmpty(),
    body('orderList').not().isEmpty(), body('address').not().isEmpty(),
    body('total').not().isEmpty(), auth,async(request, response) => {
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
        
                return response.status(200).json({ msg: 'order placed' });
            }).catch(err => {
                console.log(err);
                return response.status(500).json({ err: 'Server error' });
            });
    });

router.post("/pay",(req,res)=>{
        instance.orders.create({
            amount: 50000,
            currency: "INR"
          },(err,order)=>{
              if(err){
                  console.log(err);
              }
              else
                 console.log(order);
                 res.status(200).json(order);
          })      
    });
    
router.post('/payment-status',(req,res)=>{
       console.log("second api called");
        instance.payments.fetch(req.body.razorpay_payment_id).then((result) => {
            console.log(result);
            res.send("payment success");
        }).catch((err) => {
            console.log(err);
        });
    });
    
router.get('/view-order', routeCache.cacheSeconds(20), (request, response) => {
    Order.find().then(result => {
        console.log(result);
        response.status(200).json(result);
    }).catch(err => {
        usersLogger.error(`Unable to find user: ${err}`);
        return response.status(500).json({ err: 'Server error' });
    })

});
router.get('/p-order/:oid', routeCache.cacheSeconds(20), (request, response) => {
    Order.findOne({ oid: request.params.oid }).then(result => {
        console.log(result);
        response.status(200).json(result);
    }).catch(err => {
        return response.status(500).json({ err: 'Server error' });
    });
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
    Order.find({}).sort([
        ['date', -1]
    ]).exec(function(err, docs) {
        console.log(docs);
        console.log(err);
        response.status(200).json(docs);
    });

})
module.exports = router;