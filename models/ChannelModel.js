import mongoose from "mongoose";
const ChannelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        }
    ],
    admin:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
    ,
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',

        }
    ]


}, {
    timestamps: true,
    versionKey: false
})


ChannelSchema.pre('save',function (next){
    this.updatedAt = Date.now()
    next()
})

ChannelSchema.pre('findOneAndUpdate',function(next){
    this.set({
        updatedAt:Date.now()
    })
    next()
})


const ChannelModel = mongoose.model('Channel', ChannelSchema)

export default ChannelModel