const express = require('express');
const router = express.Router();
const routeCache = require('route-cache');
const productController = require('../controller/product.controller');
const { body } = require('express-validator');
const multer = require('multer');
const fireBase = require("../middle/fireBase");
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({ storage: storage });

router.post('/add-product', upload.array('productImages'), fireBase.fireBaseStorage, body('productName').not().isEmpty(), body('productPrice').not().isEmpty(),
    body('productQty').not().isEmpty(), body('productDescription').not().isEmpty(),
    productController.addProduct
);

router.post('/update-product/:pid', upload.array('productImages'), fireBase.fireBaseStorage, body('productName').not().isEmpty(),
    body('productPrice').not().isEmpty(), body('productQty').not().isEmpty(), body('productDescription').not().isEmpty(),
    body('productId').not().isEmpty(), productController.updateProduct
);

router.get('/product-list', routeCache.cacheSeconds(20), productController.productList);

router.delete('/delete-product/:id', productController.deleteProduct);

module.exports = router;