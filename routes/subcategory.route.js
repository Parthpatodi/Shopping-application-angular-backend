const express = require('express');
const SubCategory = require('../model/sub-category.model');
const fireBase = require("../middle/fireBase");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');
const routeCache = require('route-cache');
var storage = multer.diskStorage({
    destination: 'public/images',
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);

    }
})
var upload = multer({ storage: storage });


router.post('/add', upload.array('image'), fireBase.fireBaseStorage, (request, response) => {
    console.log(request.body);
    console.log(request.file);
    SubCategory.create({
            name: request.body.name,
            image: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
            cat_id: request.body.cat_id

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
router.get('/bySubCategory/:cid', routeCache.cacheSeconds(20), (request, response) => {
    console.log(request.params);
    SubCategory.find({ cat_id: request.params.cid }).then(result => {
        console.log(result);
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ status: 'failed' });
    })
})
router.post('/update-subcategory/:sid', upload.array('image'), fireBase.fireBaseStorage, body('name').not().isEmpty(), (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors })

    SubCategory.updateOne({ _id: request.params.sid }, {
        $set: {
            name: request.body.name,
            image: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
        }
    }).then(result => {
        console.log(result);
        if (result.modifiedCount)
            return response.status(200).json({ message: 'updated successfully' });
        else
            return response.status(404).json({ message: 'updated not successfully' });
    }).catch(err => {
        console.log(err);
        return response.status(500).json({ message: 'Opps!Something went wrong' });
    });

});

module.exports = router;