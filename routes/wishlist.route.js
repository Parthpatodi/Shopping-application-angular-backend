const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const wishController = require('../controller/wishList.controller');
const auth = require('../middle/customer.auth');

router.post("/add-to-wishlist", auth,body('userId').not().isEmpty(),body('productList').not().isEmpty(), wishController.addtoWishList);

router.get("view-wish-list/:userId", auth, wishController.viewWish);

router.delete("delete-from-wishList", auth, wishController.removeWish);

module.exports = router;