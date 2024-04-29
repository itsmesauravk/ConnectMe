const express = require('express');
const router = express.Router();


//post controller
const {
    showSpecificPost
} = require("../controller/controller")


const {
    addFriend,
    requestStatus,
    recivedFriendRequest,
    cancelRequest,
    requestedUserProfile,
    rejectRequest,
    acceptRequest,
    showFriends,
    removeFromFriend
} = require("../controller/Friend")


const {
    likeHandler,
    commentHandler
} = require("../controller/LikeCommentShare")



//showing spcific post
router.route('/post/:postId').get(showSpecificPost)

//creating new friend request
router.route('/addFriend').post(addFriend)
router.route('/show-status').get(requestStatus)
router.route('/show-recieved-friend-requests').get(recivedFriendRequest)
router.route('/cancelRequest').post(cancelRequest)
router.route('/show-request-profile').get(requestedUserProfile)
router.route('/reject-recieved-request').post(rejectRequest)
router.route('/accept-request').post(acceptRequest)
router.route('/show-friends').get(showFriends)
router.route('/remove-friend').post(removeFromFriend)


//liking the post
router.route('/post-like').patch(likeHandler)

//adding comment
router.route('/post-comment').patch(commentHandler)


module.exports = router