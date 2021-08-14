const mongoose =  require("mongoose");
const express =  require('express');
const multer = require("multer");
const apiRouter = express.Router();
// const Post = require("../models/model");
// const { rawListeners } = require("../models/model");


// getting all the post 
apiRouter.get('/allItems',async(req,res)=>{
    try {
        const allitem = await Item.find();
        res.json(allitem)
    } catch (error) {
        res.json({message: error}) 
    }

})

// file-uploading-functionality
var storage = multer.diskStorage({
    destination: function(req, res,cb){
        // cb= callback
        cb(null,'public/uploads/item')
    },
    filename:function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({storage: storage})
// creating-new item-------------------------------------------
apiRouter.post('/create-item', upload.single('itemImage') ,async(req,res)=>{
        const item = new Item({
            category:req.body.category,
            serviceProvide:[{steamWash:req.body.steamWash,dryWash:req.body.dryWash,steamIron:req.body.steamIron,dryIron:req.body.dryIron,}],
            image:req.file.filename, 
       });
   try {
     const savedItem = await item.save();
    //  const allItem = await Item.find();
    //  console.log(allItem);
     res.render('create-item',{message:"New Item has been created."});
   } catch (error) {

    res.json({message: error}) 
   }
});


// uploading file-routing
// app.post('/fileup', upload.single('proimg'), function(req, res, next){
//     var fileinfo =  req.file.filename;
//     console.log(fileinfo);
//     res.send(fileinfo)
// })




// get a specific post by id
apiRouter.get("/post/:postId", async(req,res)=>{
    console.log(req.params.postId);
   try {
    const singlePost = await Post.findById(req.params.postId);
    res.json(singlePost);
   } catch (error) {
    res.json({message: error}) 
   }
})
// Delete a specific post by id
apiRouter.delete("/post/:postId", async(req,res)=>{
   try {
    const deletePost = await Post.deleteOne({_id: req.params.postId});
    if(deletePost){
        res.json({message:"Post has been deleted!!"});
    }
   } catch (error) {
    res.json({message: error}) 
   }
})
// Update a specific post
apiRouter.patch("/post/:postId", async(req,res)=>{
    try {
     const updatedPost = await Post.updateOne({_id: req.params.postId},{$set:{title:req.body.title,description:req.body.description}});
     if(deletePost){
         res.json({message:"Post has been Updated!!"});
     }
    } catch (error) {
     res.json({message: error}) 
    }
 })

module.exports =  apiRouter;