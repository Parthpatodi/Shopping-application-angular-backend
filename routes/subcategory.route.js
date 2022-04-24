const express = require('express');
const SubCategory = require('../model/sub-category.model');
const fireBase = require("../middle/fireBase");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const multer = require('multer');

const {printLogger} = require('../core/utility');
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
    try{
    SubCategory.create({
            name: request.body.name,
            image: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
            cat_id: request.body.cat_id

        })
        .then(result => {
            console.log(result);
            printLogger(2, `*********** add subcategory *************${JSON.stringify(result)}`, 'subcategory');
            return response.status(200).json(result);


        }).catch(err => {
            console.log(err);
            printLogger(0, `*********** add category *************${JSON.stringify(err)}`, 'subcategory');
            return response.status(500).json(err);
        });
    }catch(err){
        printLogger(4, `*********** add category *************${JSON.stringify(err)}`, 'order');
        response.status(200).json(err);
    }
})

router.get('/subcategoryList', (request, response) => {
    try{
    SubCategory.find()
        .then(result => {
            console.log(result);
            printLogger(2, `*********** subCategory List *************${JSON.stringify(result)}`, 'order');
            return response.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            printLogger(0, `*********** subCategory List *************${JSON.stringify(err)}`, 'order');
            return response.status(404).json({ status: 'something went wrong' });
        })
    }catch(err){
        printLogger(4, `*********** subCategory List************${JSON.stringify(err)}`, 'order');
        response.status(500).json(err);
    }
})

router.delete('/deletecategory', (request, response) => {
    try{
    SubCategory.deleteOne({ _id: request.params.id })
        .then(result => {
            console.log(result);
            printLogger(2, `*********** delete category *************${JSON.stringify(result)}`, 'order');
            return response.status(200).json({ status: 'SubCategory Deleted' });
        })
        .catch(err => {
            console.log(err);
            printLogger(0, `*********** delete category *************${JSON.stringify(err)}`, 'sub category');
            return response.status(404).json({ status: 'SubCategory Not Deleted' });

        })
    }catch(err){
        printLogger(4, `*********** sort *************${JSON.stringify(err)}`, 'order');
        return response.status(500).json({ status: 'failed' });
    }
});
router.get('/bySubCategory/:cid', routeCache.cacheSeconds(20), (request, response) => {
    try{
    console.log(request.params);
    SubCategory.find({ cat_id: request.params.cid }).then(result => {
        console.log(result);
        printLogger(2, `***********buSubcategory *************${JSON.stringify(result)}`, 'order');
        return response.status(200).json(result);
    }).catch(err => {
        console.log(err);
        printLogger(0, `*********** sort *************${JSON.stringify(err)}`, 'order');
        return response.status(404).json({ status: 'failed' });
    })
}catch(err){
    printLogger(4, `*********** sort *************${JSON.stringify(err)}`, 'order');
    return response.status(500).json(err);
}
})
router.post('/update-subcategory/:sid', upload.array('image'), fireBase.fireBaseStorage, body('name').not().isEmpty(), (request, response) => {
    try{
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(404).json({ errors: errors })

    SubCategory.updateOne({ _id: request.params.sid }, {
        $set: {
            name: request.body.name,
            image: 'https://firebasestorage.googleapis.com/v0/b/vastram-d3e69.appspot.com/o/' + request.files[0].filename + "?alt=media&token=abcddcba",
        }
    }).then(result => {
        console.log(result);
        if (result.modifiedCount){
            printLogger(2, `*********** sort *************${JSON.stringify(result.modifiedCount)}`, 'order');
            return response.status(200).json({ message: 'updated successfully' });
        }
        else{
            printLogger(0, `*********** sort *************${JSON.stringify(result.modifiedCount)}`, 'order');
            return response.status(404).json({ message: 'updated not successfully' });
        }
    }).catch(err => {
        console.log(err);
        printLogger(0, `*********** sort *************${JSON.stringify(err)}`, 'order');
        return response.status(404).json({ message: 'Opps!Something went wrong' });
    });
}catch(err){
    printLogger(4, `*********** sort *************${JSON.stringify(err)}`, 'order');
    return response.status(500).json({ message: 'Opps!Something went wrong' });
}
});

module.exports = router;