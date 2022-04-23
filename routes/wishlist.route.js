const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const wishController = require('../controller/wishList.controller');
const auth = require('../middle/customer.auth');

router.post("/add-to-wishlist", auth,body('productId').not().isEmpty(), wishController.addtoWishList);

router.get("/view-wish-list", auth, wishController.viewWish);

router.post("/delete-from-wishList", auth, wishController.removeWish);
router.post("/delete", auth, wishController.deleteWishList);
module.exports = router;