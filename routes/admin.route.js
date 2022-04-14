const express=require('express');
const Admin =require('../model/admin.model');
const router=express.Router();
router.post('/signup',(request,response,next)=>{
    Admin.create({email:request.body.email,password:request.body.password})
    .then(result=>{
        console.log(result);
        return response.status(200).json({status:'SignUp success'});
    }).catch(err=>{
      console.log(err);
      return response.status(500).json({status:'SignUp failed'});
    })
})










module.exports=router;