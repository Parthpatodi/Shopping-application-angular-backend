const express = require('express');
const Order = require('../model/order.model');
const Cart = require('../model/cart.model');
const auth = require('../middle/customer.auth');
const { body } = require('express-validator');
const routeCache = require('route-cache');
const router = express.Router();

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
router.get('/view-order', routeCache.cacheSeconds(20), (request, response) => {
    Order.find().then(res => {
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