const express = require('express');
const Admin = require('../model/admin.model');
const adminController = require('../controller/admin.controller');
const { body } = require("express-validator");
const User = require('../model/user.model');
const router = express.Router();
router.post('/signup', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignup);



router.post('/signIn', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignIn);

router.get('/user-list',(request, response)=>{
    User.find().then(result=>{
        return response.status(200).json({ status: 'Success', result: result });
    }).catch(err => {
        console.log(err);
        return response.status(500).json(err);
    })
})






module.exports = router;