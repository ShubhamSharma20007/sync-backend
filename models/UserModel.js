import mongoose from "mongoose";
import bcrypt from "bcryptjs"
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is required !'],
    },
    password:{
        type:String,
        required:[true,'password is required !'],

    },
    firstName:{
        type:String,
        required:false
    },
    lastName:{
        type:String,
        required:false
    },
    image:{
        type:String,
        required:false
    },
    color:{
        type:Number,
        required:false
    },
    profileSetup:{
        type:Boolean,
        default : false
    }

},{
    timestamps:true,
    versionKey:false
})

// before the run model i am doing encrypt the  password

UserSchema.pre('save',async function(next) {
   try {
    const hash = await bcrypt.hash(this.password,8)
    this.password = hash
    next()
   } catch (error) {
    console.log(error)

   }
})

const UserModel =  mongoose.model('Users',UserSchema)

export default UserModel