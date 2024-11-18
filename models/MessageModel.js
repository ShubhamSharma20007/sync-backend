import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
   sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref :'Users',
    required:true
   },
   receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref :'Users',
   },
   messageType:{
    type:String,
    enum:['text','file'],
    required:true
   },
   content:{
    type:String,
    required:function(){
        return this.messageType === "text"
    }
   },
   fileUrl:{
    type:String,
    required:function(){
        return this.messageType === 'file'
    }

   }

},{
    timestamps:true,
    versionKey:false
})


const MessageModel =  mongoose.model('Message',MessageSchema)

export default MessageModel