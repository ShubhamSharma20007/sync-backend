import {Server as SocketIoServer} from "socket.io"
import MessageModel  from "./models/MessageModel.js"
import ChannelModel from "./models/ChannelModel.js";
// this is a inbuild socket server
const setupSocket =(server)=>{
    const  io  = new SocketIoServer(server,{
        cors:{
            origin:process.env.CLIENT_ORIGIN,
            methods:['GET','POST'],
            credentials:true
        }
    })

    const userSocket = new Map();

    const sendMessage = async(msg)=>{

        const sendSocketId = userSocket.get(msg.sender);
        const receiverSocketId = userSocket.get(msg.receiver);

        // create a message
        const createMessage = await MessageModel.create(msg);

        // message data
        const messagedata = await MessageModel.findById(createMessage._id)
        .populate('sender','id email lastName firstName image color')
        .populate('receiver','id email lastName firstName image color')

        if(receiverSocketId){
            io.to(receiverSocketId).emit('receive-message',messagedata)
        }
        if(sendSocketId){
            io.to(sendSocketId).emit('receive-message',messagedata)
        }

    }



    const sendChannelMessage =async(message)=>{
        
        const {sender, content, messageType,fileUrl, channel_Id} = message;

        const createMessage = await MessageModel.create({
            sender,
            content,
            messageType,
            receiver:null,
            fileUrl,
        })
        const messageData = await MessageModel.findById(createMessage._id).populate('sender' ,"id email firstName lastName image color").exec()

        await ChannelModel.findByIdAndUpdate(channel_Id,{
            $push:{
                messages:createMessage._id
            }
        })

        const channel = await ChannelModel.findById(channel_Id).populate('members')
        const finalData = {...messageData._doc,channelId:channel._id};

        if(channel && channel.members){
            channel.members.forEach((member)=>{
                const memberSocketId = userSocket.get(member._id.toString());
                if(memberSocketId){
                    io.to(memberSocketId).emit('receive-channel-message',finalData)
                }
            })
            const adminSocketId = userSocket.get(channel.admin.toString());
            if(adminSocketId){
                io.to(adminSocketId).emit('receive-channel-message',finalData)
            }
        }
      

    }
    
    io.on('connection',(socket)=>{
        const userId =  socket.handshake.query.userId;
        if(userId){
            userSocket.set(userId,socket.id)
            console.log(`user 🧑 connected ${userId} with Socket Id ${socket.id}`)
        }
        else{
            console.log('user not connected')
        }

        socket.on('send-message',sendMessage)
        socket.on('send-channel-message',sendChannelMessage)


        socket.on('disconnect',(socket)=>{
            
            console.log('user disconnect 🧑',userId)
            for(const[userId,socketId] of userSocket.entries()){
                if(socketId === socket.id){
                    userSocket.delete(userId);
                 
                    break;
                }
            }
        })
    })

}
export default setupSocket

