const express = require("express");
const router = express.Router();
const auth = require("../middle/customer.auth");
const userController = require("../controller/user.controller");
const user = require('../model/user.model')
const {printLogger} = require('../core/utility');
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


router.post("/googleSignin", async (request, response) => {
try{
    let reqBody = request.body;
  printLogger(2,`info message router with: ${JSON.stringify(reqBody)}`);
    let username = request.body.username;
    let email = request.body.email;
    let provider = request.body.provider;
    let newUser = await user.findOne({ email: email });
    if (!newUser) {
        user.create({ name: username, email: email, provider: provider })
            .then(result => {
                        
            printLogger(2,`login success : ${JSON.stringify(result)}`);
                        return response.status(200)
                            .json({
                                status: "Login Success",
                                result: result,
                      
                            });

                    })
            .catch((err) => {
                console.log(err);
                printLogger(0,`error occured in router: ${JSON.stringify(err)}`);
                return response.status(401).json(err);
            })
    }
  }
  catch(err){
    console.log(err);
    printLogger(4,`error  google login occured in router: ${JSON.stringify(err)}`);
    return response.status(401).json(err);
  }
})

router.get("/view-profile", auth, userController.viewProfile);

router.post("/edit-user", auth,
    userController.edit);

router.post("/search-product", userController.searchProducts);
// router.delete("/delete-user/:id",userController.deleteUser);

module.exports = router;