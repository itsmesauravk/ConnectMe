import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import '../App.css';
import { UserContext } from "../UserContext";


export default function InspectUserPage({ mode }) {
    const { userInfo } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const ownerId = userInfo.id;
    const [reqStatus, setReqStatus] = useState(null);
    const [senderReqNoti, setSenderReqNoti] = useState(null);
    const [comment, setComment] = useState("");

 

    const url = "http://localhost:4000";

    // Function to handle adding a friend
    const addFriend = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${url}/addFriend`, {
                senderId: ownerId, 
                receiverId: userId,
            });
            // console.log(response.data)
           if(response.data.success){
               setReqStatus();
           }

        } catch (error) {
            console.log("Error adding friend: ", error.response || error.message || error);
        } finally {
            setLoading(false);
        }
    };

    const showStatus = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/show-status?senderId=${ownerId}&receiverId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json(); 
            // console.log(data.status.status);
            setReqStatus(data.status.status);
             
        } catch (error) {
            console.log("Error showing status: ", error.response || error.message || error);
        } finally {
            setLoading(false);
        }
    }

// if i inspect the user profile and they already sent me request then
const requestedUserProfile = async () => {
    
    try {
        const response = await fetch(`${url}/show-request-profile?senderId=${userId}&receiverId=${ownerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.notifications);
        if(data.success){
            setSenderReqNoti(data.notifications);
        }
    } catch (error) {
        console.log("Error showing notifications: ", error);
    }
}

    //cancle friend request
    const cancelRequest = async () => {
        try {
            // console.log(ownerId, userId)
            setLoading(true);
            const response = await axios.post(`${url}/cancelRequest?senderId=${ownerId}&receiverId=${userId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.data;
            // console.log(data);
            setReqStatus(null);
        } catch (error) {
            console.log("Error cancelling request: ", error.response || error.message || error);
        } finally {
            setLoading(false);
        }
        
    }

    //accepting the friend request
    const acceptRequest = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${url}/accept-request`, {
                senderId: userId,
                receiverId: ownerId
            });
            console.log(response.data);
            if(response.data.success){
                setReqStatus(null);
            }
        } catch (error) {
            console.log("Error accepting request: ", error.response || error.message || error);
        } finally {
            setLoading(false);
        }
    }
    
    
    const getUsersPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${url}/yourpost/${userId}`);
            setUserData(response.data[0].user);
            setUserPosts(response.data);
        } catch (error) {
            console.log("Error getting users posts: ", error);
        } finally {
            setLoading(false);
        }
    };

     //comment handler
  const handleComment = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/post-comment`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId: userInfo.id, comment }),
        credentials: "include",
      });
  
      if (response.status === 200) {
        const updatedPost = { ...userPosts.find((post) => post._id === postId) }; // Find the post to update
        updatedPost.comments = updatedPost.comments.includes(userInfo.id)
          ? updatedPost.comments.filter((userId) => userId !== userInfo.id) // Remove the user ID if already commented
          : [...updatedPost.comments, userInfo.id]; // Add the user ID if not commented
  
        setUserPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
        setComment("");
      } else {
        alert("Comment failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  
    
    useEffect(() => {
        getUsersPosts();
        showStatus();
        requestedUserProfile();
    }, []);

    const handleLike = async (postId) => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:4000/post-like`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId, userId: userInfo.id }),
            credentials: "include",
          });
      
          if (response.status === 200) {
            const updatedPost = { ...userPosts.find((post) => post._id === postId) }; // Find the post to update
            updatedPost.likes = updatedPost.likes.includes(userInfo.id)
              ? updatedPost.likes.filter((userId) => userId !== userInfo.id) // Remove the user ID if already liked
              : [...updatedPost.likes, userInfo.id]; // Add the user ID if not liked
      
            setUserPosts((prevPosts) =>
              prevPosts.map((post) => (post._id === postId ? updatedPost : post))
            );
          } else {
            alert("Like failed");
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };


    const imageLink = "http://localhost:4000/";
    const blueTick = "https://upload.wikimedia.org/wikipedia/commons/3/32/Verified-badge.png";
    const goldTick = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2048px-Twitter_Verified_Badge_Gold.svg.png";

    if (redirect) {
        return <Navigate to="/home/users" />;
    }

    return (
        <div className="mt-5 min-h-screen">
            {loading && <div className="lds-circle"><div></div></div>}
            <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setRedirect(true)}
            >
                Back
            </button>

            {!userData && <p className="font-bold text-2xl mt-10">User has no posts uploaded!!</p>}

            {userData && (
                <div>
                    <h1 className="font-bold text-2xl mt-5">{userData?.firstName}'s Profile :</h1>

                    <div className="mt-5 mb-5">
                        {senderReqNoti && senderReqNoti.length > 0 ? 
                            <div >
                                
                                {senderReqNoti[0].status ?(
                                    <p className="font-bold text-green-600 text-2xl">Friends</p>
                                ):
                                (
                                    <div className="flex items-center justify-between">
                                        <p className="text-blue-600 font-bold">{senderReqNoti[0].content}</p>
                                        <div className="flex gap-2">
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={()=>acceptRequest()}>
                                                Accept
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        :
                        reqStatus === null &&
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={addFriend}>
                                Add Friend
                            </button>
                        }

                        {reqStatus === "requested" && 
                            <div className="flex items-center justify-between">
                                <p className="text-blue-600 font-bold">Friend request already sent.</p>
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full" onClick={cancelRequest}>
                                    Cancel Request
                                </button>
                            </div>
                        }
                    </div>



                    <div>
                        {userPosts.map((post) => (
                            <div key={post._id} className={`flex flex-col gap-5 mt-3 mb-3 p-2.5 border-2 rounded-md `}>
                                <div class={`bg-white shadow-lg rounded-md p-4 mb-6 ${mode === 'light' ? 'light-theme' : 'dark-theme'}`}>
                                    <div class="flex items-center mb-4">
                                        <img
                                            class="w-16 h-16 rounded-full object-cover mr-4"
                                            src={imageLink + post.user.profileImage}
                                            alt="profile"
                                        />
                                        <div>
                                            <div className="flex gap-2">
                                                <h1 class="text-xl font-bold">{post.user.firstName} {post.user.surname}</h1>
                                                {post.user.vipToken === "iamgold" && <img src={goldTick} alt="gold" className="w-6 h-6" />}
                                                {post.user.vipToken === "skyisblue" && <img src={blueTick} alt="blue" className="w-6 h-6" />}
                                            </div>
                                            <p class="text-gray-600">{post.user.email}</p>
                                        </div>
                                    </div>
                                    <p class="text-lg mb-4">{post.caption}</p>
                                    <img
                                        class="rounded-md w-full h-150"
                                        src={imageLink + post.image}
                                        alt="post image"
                                    />
                                </div>

                                <div className="flex items-center space-x-4 mt-5">
                                    <div className="flex gap-1 ">
                                    <span className="text-red-500 font-semibold text-xl">({post.likes && post.likes.length})</span>
                                    <button className="text-red-500 hover:text-red-700 font-semibold" onClick={()=>handleLike(post._id)}>
                                    {post.likes && post.likes.includes(userInfo.id) ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                        </svg>
                                        :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                        
                                        } 
                                    </button>
                                    </div>
                                    <div className="flex gap-1">
                                    <span className="text-blue-500 font-semibold text-xl">({post.comments && post.comments.length})</span>
                                    <button className="text-blue-500 hover:text-blue-700 font-semibold">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                        </svg>

                                    </button>
                                    </div>
                                    <button className="text-purple-500 hover:text-purple-700 font-semibold" >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                    </svg>
                                    </button>
                                </div>
                                <div className="flex items-center mt-6">
                                    <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    onChange={(event) => setComment(event.target.value)}
                                    className="w-full border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500 transition duration-300"
                                    
                                    />
                                    <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300"
                                    onClick={()=>handleComment(post._id)}
                                    >Comment</button>
                                </div>
                            </div>
                            
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
