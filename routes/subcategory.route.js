const express=require('express');
const SubCategory=require('../model/sub-category.model');
const router=express.Router();
const multer=require('multer');
var storage=multer.diskStorage({
destination:'public/images',
filename:function(req,file,cb){
   cb(null,Date.now()+"-"+file.originalname);

}
})
var upload=multer({storage:storage});
router.post('/add',upload.single('image'),(request,response)=>{
   SubCategory.create({
      name:request.body.name,
      image:'http://localhost:3000/images'+request.file.filename,
      cat_id:"12335565"

   })
   .then(result=>{
       console.log (result);
       return response.status(200).json({status:'Sub category Added'});


   }).catch(err=>{
       console.log(err);
       return response.status(500).json({status:'Sub Category Not Added'});
   })
})
  
  router.get('/subcategoryList',(request,response)=>{
      SubCategory.find()
      .then(result=>{
         console.log(result);
         return response.status(200).json(result);
      })
      .catch(err=>{
          console.log(err);
          return response.status(500).json({status:'something went wrong'});
      })
  })
     
   router.delete('/deletecategory',(request,response)=>{
       SubCategory.deleteOne({_id:request.params.id})
       .then(result=>{
           console.log(result);
           return response.status(200).json({status:'SubCategory Deleted'});
       })
       .catch(err=>{
           console.log(err);
           return response.status(500).json({status:'SubCategory Not Deleted'});

       })
   })

module.exports=router;
