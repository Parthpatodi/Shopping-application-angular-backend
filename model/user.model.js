const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : { 
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        required : true
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    avatar:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }


});
module.exports = mongoose.model("users",userSchema);