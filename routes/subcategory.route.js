const express = require('express');
const SubCategory = require('../model/sub-category.model');
const fireBase = require("../middle/fireBase");
const router = express.Router();
const multer = require('multer');
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);

    }
})
var upload = multer({ storage: storage });


router.post('/add', upload.array('image'), fireBase.fireBaseStorage, (request, response) => {
    SubCategory.create({
            name: request.body.name,
            image: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
            cat_id: request.body.categoryId

        })
        .then(result => {
            console.log(result);
            return response.status(200).json({ status: 'Sub category Added' });


        }).catch(err => {
            console.log(err);
            return response.status(500).json({ status: 'Sub Category Not Added' });
        })
})

router.get('/subcategoryList', (request, response) => {
    SubCategory.find()
        .then(result => {
            console.log(result);
            return response.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ status: 'something went wrong' });
        })
})

router.delete('/deletecategory', (request, response) => {
    SubCategory.deleteOne({ _id: request.params.id })
        .then(result => {
            console.log(result);
            return response.status(200).json({ status: 'SubCategory Deleted' });
        })
        .catch(err => {
            console.log(err);
            return response.status(500).json({ status: 'SubCategory Not Deleted' });

        })
});
router.get('/bySubCategory/:cid', (request, response) => {
    SubCategory.findOne({ _id: request.params.cid }).then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ status: 'failed' });
    })
})

module.exports = router;