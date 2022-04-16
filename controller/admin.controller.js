const crypto = require("crypto");
const { validationResult } = require("express-validator");
const Admin = require('../model/admin.model');
var key = "password";
var algo = "aes256";
exports.adminSignup = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    var cipher = crypto.createCipher(algo, key);
    var encrypted =
        cipher.update(request.body.password, "utf8", "hex") + cipher.final("hex");
    Admin.create({ email: request.body.email, password: encrypted })
        .then(result => {
            console.log(result);
            return response.status(200).json({ status: 'Success', result: result, });
        }).catch(err => {
            console.log(err);
            return response.status(500).json({ status: 'SignUp failed' });
        })
}
exports.adminSignIn = (request, response, next) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    Admin.findOne({ email: request.body.email }).then((result) => {
        var decipher = crypto.createDecipher(algo, key);
        var decrypted =
            decipher.update(result.password, "hex", "utf8") +
            decipher.final("utf8");
        if (decrypted == request.body.password) {
            return response.status(200).json({ status: 'SignIn success' });
        } else {
            return response.status(400).json({ status: 'Password has not match ! Try Again..' });
        }

    }).catch((err) => {
        console.log(err);
        return response.status(401).json(err);
    });
}