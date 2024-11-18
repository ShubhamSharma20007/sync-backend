import express from "express"
import {
searchContacts,
getContactForDMList,
getAllContacts
} from "../controllers/contact_controller.js";
import {auth} from "../middlewares/auth_middleware.js"

const contactRouter = express.Router();

contactRouter.post('/search-contact',auth,searchContacts)
contactRouter.get('/get-contacts-for-dm',auth,getContactForDMList)
contactRouter.get('/get-all-contacts',auth,getAllContacts)


export default contactRouter;
