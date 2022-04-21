const express = require("express");
const router = express.Router();
const auth = require("../middle/customer.auth");
const userController = require("../controller/user.controller");
const user = require('../model/user.model')

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


router.post("/googleSignin", async(request, response) => {
            let username = request.body.username;
            let email = request.body.email;
            let provider = request.body.provider;

            let newUser = await user.findOne({ email: email });
            if (!newUser) {
                user.create({ name: username, email: email, provider: provider })
                    .then(result => {
                        const payload = {
                            user: {
                                id: result._id
                            }
                        };
                        jwt.sign(
                            payload,
                            config.get('jwtSecret'), { expiresIn: '5 days' },
                            (err, token) => {
                                if (err) throw err;
                                console.log(token);
                                return response.status(200)
                                    .json({
                                        status: "Login Success",
                                        result: result,
                                        token: token
                                    });

                            })
                    }).catch((err) => {
                        console.log(err);
                        return response.status(401).json(err);
                    })





                router.get("/view-profile/:id", auth, userController.viewProfile);

                router.post("/edit-user", auth,
                    body("name").notEmpty(),
                    body("email").isEmail(),
                    body("address").notEmpty(),
                    body("mobile").isMobilePhone(),
                    userController.edit);

                router.post("/search-product", userController.searchProducts);
                // router.delete("/delete-user/:id",userController.deleteUser);

                module.exports = router;