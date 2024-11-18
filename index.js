import dotenv from "dotenv"
import express from "express"
import mongoose  from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth_route.js"
import contactRouter from "./routes/contact_route.js"
import messageRouter from "./routes/messages_route.js"
import channelRouter from "./routes/channel_route.js"
import {fileURLToPath} from "url"
import path from "path"
import setupSocket from "./socket.js"
const app = express()


dotenv.config()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))  // it's allow to the formData
const dirname = path.dirname(fileURLToPath(import.meta.url))



app.use('/',express.static(path.join(dirname,'public')))
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'https://sync-chat-app.netlify.app',
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the HTTP methods you allow
    credentials: true, // Allows cookies and credentials to be sent
    allowedHeaders: ["Content-Type", "Authorization"], // Include any custom headers you use
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", process.env.CLIENT_ORIGIN || "https://sync-chat-app.netlify.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});



app.use('/api/auth',authRouter)
app.use('/api/contact',contactRouter)
app.use('/api/messages',messageRouter)
app.use('/api/channel',channelRouter)


// download the image 
app.get('/download-image/:filePath',async(req,res)=>{
   const dirname = path.dirname(fileURLToPath(import.meta.url))
   const imagePath = path.join(dirname,"public",'uploads',"files", req.params.filePath);
   res.download(imagePath,req.params.filePath,(err)=>{
    if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file");
    }
   })
    
})



// listen server
let port = process.env.PORT || 3001
const server  = app.listen(port,()=>console.log(`server is listing on ${port} ✅`))

// socket setup
setupSocket(server)

// DB CONNECTION
const db_path = process.env.DATABASE_URL
mongoose.connect(db_path)
.then(res=>console.log('database connected ⚙️'))
.catch(err=>console.log(err))


