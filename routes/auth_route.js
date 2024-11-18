import express from "express"
import { signUp ,
    login,
    userInfo,
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logout
} from "../controllers/auth_controller.js";
import { auth } from "../middlewares/auth_middleware.js";
import {upload} from "../lib/multer.js";
const authRouter = express.Router();

// const uploads = multer({dest:'uploads/profiles/'})

authRouter.post('/signup',signUp)
authRouter.post('/login',login)

authRouter.get('/user-info',auth,userInfo)
authRouter.post('/update-profile',auth,updateProfile)
authRouter.post('/add-profile-image',auth,upload.single('avatar'),addProfileImage)
authRouter.get('/remove-profile-image',auth,removeProfileImage)
authRouter.get('/logout',logout)





export default authRouter;
