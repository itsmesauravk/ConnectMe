
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
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String
      }]
    
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});


const Post = mongoose.model('Post', PostSchema)
module.exports = Post