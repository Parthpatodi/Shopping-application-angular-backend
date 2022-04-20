const express = require("express");
const router = express.Router();
const auth = require("../middle/customer.auth");
const userController = require("../controller/user.controller");

const { body } = require("express-validator");

router.post("/signup",
    body("name").notEmpty(),
    body("email").isEmail(),
    body("address").notEmpty(),
    body("password", "password minimum length must be 6").isLength(6),
    body("mobile").isMobilePhone(),
    userController.signup);

router.get("/verify-account/:id", userController.verify);

router.post("/signin",
    body("email", "Invalid Email Id").isEmail(),
    body("password").notEmpty(),
    userController.signin);

router.get("/view-profile/:id", auth, userController.viewProfile);

router.post("/edit-user", auth,
    body("name").notEmpty(),
    body("email").isEmail(),
    body("address").notEmpty(),
    body("mobile").isMobilePhone(),
    userController.edit);

router.post("/search-product",userController.searchProducts);
// router.delete("/delete-user/:id",userController.deleteUser);

module.exports = router;