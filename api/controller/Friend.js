const Notification = require('../schema/NotificationSchema')
const Users = require('../schema/Users')
const Friend = require('../schema/FriendshipSchema')



//for creating new friend request
const addFriend = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        
        // Checking whether sender or receiver exist or not
        const checkSender = await Users.findById(senderId);
        const checkReceiver = await Users.findById(receiverId);
        
        if (!checkSender || !checkReceiver) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        // Creating notification
        const newNotification = await Notification.create({
            senderId: senderId,
            receiverId: receiverId,
            content: 'sent you a friend request.',
        });
        
        if (!newNotification) {
            return res.status(400).json({ success: false, message: "Error creating notification." });
        }
        
        // Creating friend request
        const newFriend = await Friend.create({
            senderId: senderId,
            receiverId: receiverId,
        }); 
        
        if (!newFriend) {
            return res.status(400).json({ success: false, message: "Error creating friend request." });
        }
        
        res.status(200).json({ success: true, message: "Request sent successfully." });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}


// for showing the friend request status
const requestStatus = async (req, res) => {
    try {
        const senderId = req.query.senderId; 
        const receiverId = req.query.receiverId; 
        // console.log(senderId, receiverId);
        
        // checking the status
        const status = await Friend.findOne({
            senderId: senderId,
            receiverId: receiverId
        });
        
        if (!status) {
            return res.status(404).json({ success: false, message: "Status not found." });
        }
        
        res.status(200).json({ success: true, status });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


//for showing notification or showing that I have recieved the friend request from other
const recivedFriendRequest = async (req, res) => {
    try {
        const userId = req.query.receiverId;

        const showReq = await Notification.find({ receiverId: userId }).populate('senderId');
        if (!showReq || showReq.length === 0) {
            return res.status(404).json({ success: false, message: "No notifications found." });
        }

        res.status(200).json({ success: true, notifications: showReq });
    } catch (error) {
        console.log("Error fetching notifications: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}


//cancel friend request
const cancelRequest = async (req, res) => {
    try {
        const senderId = req.query.senderId;
        const receiverId = req.query.receiverId;

        const deleteReqNotification = await Notification.findOneAndDelete({
            senderId: senderId,
            receiverId: receiverId
        });
        const deleteReqFriend = await Friend.findOneAndDelete({
            senderId: senderId,
            receiverId: receiverId
        });

        if (!deleteReqNotification || !deleteReqFriend) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        res.status(200).json({ success: true, message: "Request cancelled successfully." });
    }
    catch (error) {
        console.log("Error cancelling request: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

// if i inspect the user profile and they already sent me request then
const requestedUserProfile = async (req, res) => {
    try {
        const senderId = req.query.senderId;
        const receiverId = req.query.receiverId;

        const showReq = await Notification.find({ senderId: senderId, receiverId: receiverId });
        if (!showReq || showReq.length === 0) {
            return res.status(404).json({ success: false, message: "No notifications found." });
        }

        res.status(200).json({ success: true, notifications: showReq });
    } catch (error) {
        console.log("Error fetching notifications: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

//rejecting received request
const rejectRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const deleteReqNotification = await Notification.findOneAndDelete({
            senderId: senderId,
            receiverId: receiverId
        });
        const deleteReqFriend = await Friend.findOneAndDelete({
            senderId: senderId,
            receiverId: receiverId
        });

        if (!deleteReqNotification || !deleteReqFriend) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        res.status(200).json({ success: true, message: "Request cancelled successfully." });
    }
    catch (error) {
        console.log("Error cancelling request: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}


//accepting the friend request
const acceptRequest = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const updatRequestNotification = await Notification.findOneAndUpdate({
            senderId: senderId,
            receiverId: receiverId
        }, {
            content: 'you both are friends now.',
            status:true
        });

        //for deleting the requested status
        const deleteRequestFriend = await Friend.findOneAndUpdate({
            senderId: senderId,
            receiverId: receiverId
        },{
            status:"accepted"
        })

        if (!updatRequestNotification || !deleteRequestFriend) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        //adding friend to the user profile
        //adding friend to the reciver profiel
        const addFriendReciver = await Users.findOneAndUpdate({
            _id: receiverId
        }, {
            $push: { friends: senderId }
        });

        //adding friend to the sender profile
        const addFriendSender = await Users.findOneAndUpdate({
            _id: senderId
        }, {
            $push: { friends: receiverId }
        });

        if (!addFriendReciver || !addFriendSender) {
            return res.status(404).json({ success: false, message: "Request not found." });
        }
        res.status(200).json({ success: true, message: "Request accepted successfully." });

    } catch (error) {
        console.log("Error accepting request: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}     


//show all friends
const showFriends  = async (req, res) => {
    try {
        const userId = req.query.userId;
        const user = await Users.findById(userId).populate('friends');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.status(200).json({ success: true, friends: user.friends });
    } catch (error) {
        console.log("Error fetching friends: ", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

const removeFromFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Remove from friendstatus
        const removeFriendStatus = await Friend.findOneAndDelete({
            $or: [
                { $and: [{ senderId: userId }, { receiverId: friendId }] },
                { $and: [{ senderId: friendId }, { receiverId: userId }] },
            ]
        });

        // Remove from notification
        const removeNotification = await Notification.findOneAndDelete({
            $or: [
                { $and: [{ senderId: userId }, { receiverId: friendId }] },
                { $and: [{ senderId: friendId }, { receiverId: userId }] },
            ]
        });

        // Remove from profile
        const deleteFriend = await Users.findByIdAndUpdate(userId, {
            $pull: { friends: friendId }
        });

        //remove from friend profile
        const deleteFriendFromFriend = await Users.findByIdAndUpdate(friendId, {
            $pull: { friends: userId }
        });

        if (!removeFriendStatus || !removeNotification || !deleteFriend || !deleteFriendFromFriend) {
            return res.status(404).json({ success: false, message: "Remove from friend unsuccessful" });
        }
        res.status(200).json({ success: true, message: "Remove from friend successful" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}



module.exports ={
    addFriend,
    requestStatus,
    recivedFriendRequest,
    cancelRequest,
    requestedUserProfile,
    rejectRequest,
    acceptRequest,
    showFriends,
    removeFromFriend
}