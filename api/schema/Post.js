
const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    caption: String,
    image: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    comments: [{
        commenter: [{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users' 
        }],
        comment: String
    }]
}, {
    timestamps: true 
});



const Post = mongoose.model('Post', PostSchema)
module.exports = Post