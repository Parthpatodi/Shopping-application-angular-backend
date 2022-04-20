const User = require("../model/user.model");
const {validationResult} = require("express-validator");
const gravatar = require("gravatar");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Product = require("../model/product.model");
const config = require('config');
let jwt = require("jsonwebtoken");
var key = "password";
var algo = "aes256";

exports.signup = async (request,response)=>{
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).json({ errors: errors.array() }); 
        const {name ,email,password,address,mobile} = request.body;
          let user = await User.findOne({email}); 
          if(user){
            return response.status(400).json({msg:"already exists"})
          }

    var cipher = crypto.createCipher(algo, key);
    var encrypted =
      cipher.update(password, "utf8", "hex") + cipher.final("hex");
      const avatar = gravatar.url(email,{
        s:'200',
        r:'pg',
         d:'mm'
       });
     user = new User({
      name,
      email,
      password: encrypted,
      address,
      mobile,
      avatar
    });
    user
      .save()
      .then((result) => {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "vastram823@gmail.com",
            pass: "fcv@1234",
          },
        });
  
        var message = {
          from: "vastram823@gmail.com",
          to: request.body.email,
          subject: "Confirm your account on Vivah",
          html:
            '<p>Thanks for signing up with Vivah! You must follow this link within 30 days of registration to activate your account:</p><a href= "https://vivah-backend.herokuapp.com/user/verify-account/' +
            result._id +
            '">click here to verify your account</a><p>Have fun, and dont hesitate to contact us with your feedback</p><br><p> The Vivah Team</p><a href="https://vivah-backend.herokuapp.com/">book-your-meal.herokuapp.com/</a>'
        };
  
        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log("SUCCESS===================================\n" + info);
            //   console.log();
          }
        });
  
        console.log(result);
        return response.status(200).json(result);
      })
      .catch((err) => {
        console.log(err);
        return response.status(500).json({ message: "Something went Wrong" });
      });
}

exports.verify = (request, response) => {
    User.updateOne(
      { _id: request.params.id },
      {
        $set: {isVerified: true}
      }
    )
    .then((result) => {
        if (result.modifiedCount) {
              return response.status(202).json({message : "Your Account is verified . Now you can login"});
            }
        })
      .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
      });
  };
  
exports.signin = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).json({ errors: errors.array() });
    User.findOne({ email: request.body.email })
      .then((result) => {
        var decipher = crypto.createDecipher(algo, key);
        var decrypted =
          decipher.update(result.password, "hex", "utf8") +
          decipher.final("utf8");
         if(result.isVerified == true ){
            if (decrypted == request.body.password){
              const payload = {
                user: {
                  id: result._id
                }
              };
              jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '5 days' },
                (err, token) => {
                  if (err) throw err;
                  console.log(token);
                  return response.status(200)
               .json({
                status:"Login Success",
                result : result ,
                token : token
              }); 
                })
             
           }
          else 
              return response.status(202).json({ message: "Invalid Password" });     
          }
         else
         return response.status(500).json({message : "Please verify your accout first then login"});
    })
      .catch((err) => {
        console.log(err);
        return response.status(401).json(err);
      });
  };
  
  exports.viewProfile = (request, response) => {
    User.findOne({ _id: request.params.id },{password:0 ,isVerified:0})
      .then((result) => {
        return response.status(200).json(result);
      })
      .catch((err) => {
        return response.status(401).json(result);
      });
  };

 exports.edit = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).json({ errors: errors.array() });
    User.updateOne(
      { _id: request.body.userId },
      {
        $set: {
          name: request.body.name,
          email: request.body.email,
          address: request.body.address,
          mobile: request.body.mobile,
        }
      }
    )
      .then((result) => {
        if (result.modifiedCount) {
          User.findOne({ _id: request.body.userId })
            .then((result) => {
              return response.status(202).json(result);
            })
            .catch((err) => {
              return response.status(500).json(err);
            });
        }
      })
      .catch((err) => {
        return response.status(500).json(err);
      });
  };
  
  exports.searchProducts = (request, response) => {
    var regex = new RegExp(request.body.text, "i");
    Product.find({ productName: regex })
      .then((result) => {
        return response.status(200).json(result);
          })
      .catch((err) => {
        console.log(err);
        return response.status(500).json({ message: "Somthing went wrong" });
      });
  };