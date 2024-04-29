const Post = require("../schema/Post");
const User = require("../schema/Users");

const showSpecificPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate({
            path: "comments",
            populate: {
                path: "user",
                model: "Users"
            }
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    showSpecificPost
}
