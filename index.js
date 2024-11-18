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

app.use(function (req, res, next) {
    // Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});

app.use(cors({
    origin:"*",
    // origin:'https://sync-chat-app.netlify.app',
    methods:"*",
    credentials:true // using this we can use withCredentials in request that can help us to add token directly in the browser cookie 
    // Allow cookies to be sent with the request
}))


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


