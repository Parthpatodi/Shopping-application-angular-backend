const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controller/cart.controller');
const auth = require('../middle/customer.auth');


router.post("/add-to-cart",auth,
    body('productId').not().isEmpty(), cartController.addtoCart);

router.get("/view-carts", auth, cartController.viewCart);

router.delete("delete-from-cart", auth, cartController.delCart);

module.exports = router;