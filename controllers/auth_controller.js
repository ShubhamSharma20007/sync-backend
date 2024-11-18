import UserModel from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import fs from "fs"
import path from "path";
import {fileURLToPath} from "url"
// genrate the token
const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days
const createToken = (email, userId) => {
  let payload = {
    email,
    userId
  }
  const token = jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: maxAge
  })
  return token
}

export const signUp = async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required", success: false })
    }
    // find the user is already exisitng or not
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "user already exists", success: false })
    }
    const user = await UserModel.create({ email, password })
    const token = createToken(email, user._id)
    res.cookie('jwt_token', token, {
      maxAge,
      secure: true,
      sameSite: 'None'
    })
    return res.status(201).json({
      user: {
        token,
        user
      }, success: true, message: 'User created successfully'
    })

  } catch (error) {
    return res.status(500).json({ error, success: false })

  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "email and password are required", success: false })
    }
    // find the user is already exisitng or not
    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
      return res.status(400).json({ message: "user does not exist", success: false })
    }
    // compare the password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password is incorrect", success: false })
    }
    const token = createToken(email, existingUser._id);
    res.cookie('jwt_token', token, {
      maxAge,
      secure: true,
      sameSite: 'None'
    })
    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      user: {
        token,
        user: existingUser
      }
    })


  } catch (error) {
    return res.status(500).json({ error, success: false })

  }
}


export const userInfo = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false })
    }
    const getUser = await UserModel.findOne({ _id: user.userId })
    if (!getUser) {
      return res.status(401).json({ message: "Unauthorized", success: false })
    }
    return res.status(200).json({
      success: true,
      user: getUser
    })

  } catch (error) {
    return res.status(501).json({ success: false, message: error.message })
  }
}

export const updateProfile = async (req, res) => {


  try {
    const { user } = req;
    const { firstName, lastName, color } = req.body;


    if (!firstName || !lastName) {
      return res.status(400).json({ message: "firstName,lastName and color are required", success: false })
    }
    const updatedUser = await UserModel.findByIdAndUpdate(user.userId, { firstName, lastName, color, profileSetup: true }, { new: true, runValidators: true })

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedUser
    })
  } catch (error) {
    return res.status(501).json({ success: false, message: error.message })
  }
}

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a profile image", success: false })
    }
    if (req.file.size > 1 * 1024 * 1024) {
      return res.status(400).json({ message: "File size should be less then 1 mb ", success: false })
    }
    const { user } = req;
    const updatedUser = await UserModel.findByIdAndUpdate(user.userId, { image: req.file.filename }, { new: true, runValidators: true })
    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully',
      updatedUser
    })
  } catch (error) {
    return res.status(501).json({ success: false, message: error })
  }
}


export const removeProfileImage = async(req,res)=>{
  const {user} = req;
  try {
    const currentUser = await UserModel.findById(user.userId);
    if (!currentUser) {
      return res.status(400).json({ message: "User not found", success: false })
    }
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const imagePath = path.join(dirname,`../uploads/profiles${currentUser.image}`);

    const updateUser = await UserModel.findByIdAndUpdate(currentUser._id,{
      image : ""
    },{
      new:true,
      runValidators:true
    })
    
    if(fs.existsSync(imagePath)){
      fs.unlinkSync(imagePath)
    }
    
    
   
    return res.status(200).json({
      success: true,
      message: 'Profile image removed successfully',
      updateUser
    });
  } catch (error) {
    return res.status(501).json({ success: false, message: error })
    
  }
}


export const logout =  async(req,res)=>{
  res.clearCookie('jwt_token')
  return res.status(200).json({
    success:true,
    message:"Logout successfully"
  })

}