
const mongoose = require("mongoose")

const NotificationSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    content:{
        type: String,  
    },
    status:{
        type: Boolean,
        default: false
    }
}, {timestamps: true})


module.exports = mongoose.model("Notification", NotificationSchema)
