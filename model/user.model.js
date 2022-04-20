const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : { 
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
    },
    address : {
        type : String,
    },
    mobile : {
        type : Number,
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    avatar:{
        type:String,
    },
    provider:{
        type : String,
        default : null
    },
    date:{
        type:Date,
        default:Date.now
    }


});
module.exports = mongoose.model("users",userSchema);