const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controller/cart.controller');
const auth = require('../middle/customer.auth');


router.post("/add-to-cart",auth,
    body('productId').not().isEmpty(), cartController.addtoCart);

router.get("/view-carts", auth, cartController.viewCart);

router.post("/remove-from-cart", auth, cartController.delCart);


router.post("/delete-carts", auth, cartController.deleteCart);
module.exports = router;