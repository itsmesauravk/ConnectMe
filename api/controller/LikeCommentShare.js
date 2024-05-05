const User = require("../schema/Users");
const Post = require("../schema/Post");


const likeHandler = async (req, res) => {
    try {
        const {postId,userId} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.likes.includes(userId)) {
            await post.likes.pull(userId);
            await post.save();
            return res.status(200).json({ message: "Post unliked" });
        }
        post.likes.push(userId);
        await post.save();
        res.status(200).json({ message: "Post liked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


//comment handlear
const commentHandler = async (req, res) => {
    try {
        const {postId,userId,comment} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.comments.push({commenter:userId,comment});
        await post.save();
        res.status(200).json({ message: "Comment added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}




module.exports = {
    likeHandler,
    commentHandler
}