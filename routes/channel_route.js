import express from "express"
import {
    createChannel,
    getUsersChannel,
    getChannelMessages
} from "../controllers/channel_controller.js";
import {auth} from "../middlewares/auth_middleware.js"

const channelRouter = express.Router();

channelRouter.post('/create-channel',auth,createChannel)
channelRouter.get('/get-users-channel',auth,getUsersChannel)
channelRouter.get('/get-channel-messages/:channelId',auth,getChannelMessages)


export default channelRouter;
