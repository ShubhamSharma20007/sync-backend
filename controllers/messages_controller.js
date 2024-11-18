import MessageModel from "../models/MessageModel.js";
import fs, { mkdir, mkdirSync, renameSync } from "fs"
export const getMessage = async (req, res) => {
    try {
        const user1 = req.user.userId;
        const user2 = req.body.id;

        
        if (!user1 || !user2) {
            return res.status(400).json({ message: "user1 and user2 are required", success: false })
             
        }
      const messages = await MessageModel.find({
        $or:[
            {sender:user1,receiver:user2},
            {sender:user2,receiver:user1}
        ]
      }).sort({
        createdAt:1
      })
        return res.status(201).json({
            success: true,
            messages
        })
    } catch (error) {
        return res.status(501).json({ success: false, message: error })

    }

}

export const uploadChatFile = async(req,res)=>{
  // 1 * 1024 * 1024 = 1mb 
 try {
  
  const file = req.file
  if(!file){
    return res.status(400).json({
      success:false,
      message:'file is required !'
    })
  }
  if(file.size> 3*1024*1024){
    return res.status(400).json({message:"File size should be less then 3 mb ",success:false})
  }
  return res.status(200).json({
    success:true,
    message:"File uploaded successfully",
    file:file.filename
  })
 } catch (error) {
  console.log(error)
  return res.status(501).json({success:false,message:error})
  
 }

}

// {
//   fieldname: 'file',
//   originalname: 'quotation .pdf',
//   encoding: '7bit',
//   mimetype: 'application/pdf',
//   destination: './public/uploads/files/',
//   filename: '1730565747673-quotation .pdf',
//   path: 'public\\uploads\\files\\1730565747673-quotation .pdf',
//   size: 844395
// }