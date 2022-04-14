const express=require('express');
const Order =require('../model/order.model');
const Cart = require('../model/cart.model');
const auth = require('../middle/customer.auth');
const { body } = require('express-validator');
const router=express.Router();
   router.post('/place-order', body('mobile').not().isEmpty(),
   body('orderList').not().isEmpty(), body('address').not().isEmpty(),
   body('total').not().isEmpty(),async (request, response) => {
      const{address,mobile,total}=request.body;
      // const {userId} = request.user.id;
     const orderItem = {address,mobile,total};
       console.log(request.body);
       console.log(orderItem);
       
       var order = new Order(orderItem);
       for(i=0;i<request.body.orderList.length;i++){
           var pid  =  request.body.orderList[i].pId;
           var qty2 = request.body.orderList[i].qty;
           order.orderList.push({pid:pid,quantity:qty2});
       }
        
     
         order.save()
             .then(result => {
                 console.log(result);
                 Cart.deleteOne({}).then(result => {
                  return response.status(200).json(result);
                 }).catch(err=>{
                  return response.status(500).json({ err: 'Cart not deleted' });
                 });
             }).catch(err => {
                 console.log(err);
                 return response.status(500).json({ err: 'Server error' });
             });
});
 router.get('/view-order',auth,(request,response)=>{
    Order.find().then(result => {
       console.log(result);
      response.status(200).json(result);
    }).catch(err=>{
      return response.status(500).json({ err: 'Server error' });
    })
   
 });

module.exports=router;