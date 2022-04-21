const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controller/cart.controller');
const auth = require('../middle/customer.auth');


router.post("/add-to-cart",auth,
    body('productList').not().isEmpty(), cartController.addtoCart);

router.get("view-cart/:userId", auth, cartController.viewCart);

router.delete("delete-from-cart", auth, cartController.delCart);

module.exports = router;