import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


const createToken = (id) => {
   return jwt.sign({id},process.env.JWT_SECRET)
}

//Register User
const registerUser = async (req,res) => {
    const {name,email,password} = req.body;

    try {

        //Checking if User already exist
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"})
        }

        //Validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter a Valid E-mail"})

        }
        
        //Checking For Strong Password
        if(password.length<8){
            return res.json({success:false,message:"Please Enter a Strong Password"})

        }

        //Hashing User Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Some Error Occured"})
    }
}

//Login User
const loginUser = async (req,res) => {
    const {email,password} = req.body;

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User Doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Some Error Occured"})
    }
    
}

export {loginUser,registerUser};