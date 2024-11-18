import express from "express"
import {
getMessage,
uploadChatFile
} from "../controllers/messages_controller.js";
import {auth} from "../middlewares/auth_middleware.js"
import {fileUpload} from "../lib/multer.js"

const messageRouter = express.Router();

messageRouter.post('/get-messages',auth,getMessage)
messageRouter.post('/upload-chat-file',auth,fileUpload.single('file'),uploadChatFile)


export default messageRouter;
