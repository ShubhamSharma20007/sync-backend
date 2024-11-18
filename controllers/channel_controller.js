import mongoose from "mongoose";
import ChannelModel from "../models/ChannelModel.js"
import UserModel from "../models/UserModel.js";
export const createChannel = async (req, res) => {
    try {
        // note here is members comes in array
        const { name, members } = req.body;
        const userId = req.user.userId;
        const admin = await UserModel.findById(userId);
        if (!admin) return res.status(400).json({
            success: false,
            message: "User not found"
        })

        // get all the member is existin in an array
        const validMembers = await UserModel.find({
            _id: {
                $in: members
            }
        })

        if (validMembers.length !== members.length) {
            return res.status(400).json({
                success: false,
                message: "Some member are not valid users"
            })
        }

        const newChannel = new ChannelModel({
            name,
            members,
            admin: userId,

        })
        await newChannel.save();

        return res.status(201).json({
            success: true,
            message: "Channel created successfully",
            channel: newChannel
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error
        })

    }
}


export const getUsersChannel = async (req, res) => {
  
    try {
        const { userId } = req.user
        const objectUserId = new mongoose.Types.ObjectId(userId);
        const channels = await ChannelModel.find({
            $or: [
                { admin: objectUserId },
                {members :{$in :[objectUserId]}}
                
            ]
        }).sort({
            updatedAt:-1
        })

        return res.status(201).json({
            success: true,
            message: "channels found",
            channels
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}


// get channel messages
export const getChannelMessages = async (req, res) => {
   try {
    const { channelId } = req.params;
    const messages = await ChannelModel.findById(channelId).populate({
        path:"messages",
        populate:{
            path:'sender',
            select:'_id email firstName lastName image color'
        }
    })

    if(!messages){
        return res.status(404).json({
            success:false,
            message:"Channel not found"
        })
    }
    return res.status(201).json({
        success: true,
        message: "messages found",
        messages
    })
   } catch (error) {
    
   }
}