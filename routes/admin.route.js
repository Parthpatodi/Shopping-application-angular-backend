const express = require('express');
const Admin = require('../model/admin.model');
const adminController = require('../controller/admin.controller');
const { body } = require("express-validator");
const router = express.Router();
router.post('/signup', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignup);



router.post('/signIn', body("email").isEmail(),
    body("password", "password minimum length must be 6").isLength(6),
    adminController.adminSignIn);








module.exports = router;