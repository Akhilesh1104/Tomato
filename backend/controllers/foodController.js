import foodModel from "../models/foodModel.js";
import { v2 as Cloudinary } from "cloudinary";

import fs from "fs";

//All Food Items 
const listFood = async (req,res) =>{
    try {
        const foods = await foodModel.find();
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Some Error occured"})
    }
}

//Add Food Item
const addFood = async (req,res) => {
    try{
    
    const imageFile = req.file;
    //Upload Image to Cloudinary
    const imageUpload = await Cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;  

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: imageUrl,
    })

        await food.save();
        res.json({success:true,message:"Food Added"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Some Error Occured"})
    }
}


//Remove Food Item
const removeFood = async (req,res) =>{
   try {

      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`,()=>{})
      await foodModel.findByIdAndDelete(req.body.id);
    res.json({success:true,message:"Food Removed"})
   } catch (error) {

    console.log(error)
    res.json({success:false,message:"Some Error Occured"})

   }
}
export {addFood,removeFood,listFood};