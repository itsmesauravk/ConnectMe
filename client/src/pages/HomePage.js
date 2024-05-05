import React, { useState, useEffect, useContext} from "react";
// import { UserContext } from "../UserContext";
import '../App.css'
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";


function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric'};
  return new Date(dateString).toLocaleString('en-US', options);
}
const defaultMaleImage = "https://www.w3schools.com/howto/img_avatar.png";
const defaultFemaleImage = "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png";
const defaultCustomImage = "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg";

//formating time
function formatDateDifference(postDate) {
  const now = new Date();
  const formattedPostDate = new Date(postDate);
  
  const timeDiff = now - formattedPostDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Assuming 30 days in a month
  const years = Math.floor(days / 365); // Assuming 365 days in a year

  if (days === 0) {
    return "Today";
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 30) {
    return `${days} days ago`;
  } else if (months === 1) {
    return "1 month ago";
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return "1 year ago";
  } else {
    return `${years} years ago`;
  }
}


export default function HomePage({mode}) {
  const {userInfo} = useContext(UserContext)

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  
  const imageLink = "http://localhost:4000/"
  //  console.log("UserInfo :", userInfo.id)
  //  console.log(posts)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:4000/allpost", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 200) {
          const data = await response.json();
          setPosts(data); // Update state with fetched posts
          // console.log("Data :", data)
        } else {
          alert("Posts not found");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []); // Empty dependency array ensures the effect runs once on component mount
  // console.log(posts)
  const blueTick = "https://upload.wikimedia.org/wikipedia/commons/3/32/Verified-badge.png";
  const goldTick = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2048px-Twitter_Verified_Badge_Gold.svg.png";

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
        const updatedPost = { ...posts.find((post) => post._id === postId) }; // Find the post to update
        updatedPost.likes = updatedPost.likes.includes(userInfo.id)
          ? updatedPost.likes.filter((userId) => userId !== userInfo.id) // Remove the user ID if already liked
          : [...updatedPost.likes, userInfo.id]; // Add the user ID if not liked
  
        setPosts((prevPosts) =>
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
        const updatedPost = { ...posts.find((post) => post._id === postId) }; // Find the post to update
        updatedPost.comments = updatedPost.comments.includes(userInfo.id)
          ? updatedPost.comments.filter((userId) => userId !== userInfo.id) // Remove the user ID if already commented
          : [...updatedPost.comments, userInfo.id]; // Add the user ID if not commented
  
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? updatedPost : post))
        );
        setComment("");
      } else {
        console.log("Comment failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <div className="overflow-hidden">
  {posts.length > 0 && (
    <div className="flex flex-col gap-8 mt-5">
      {posts.map((post) => (
        <div key={post._id} className={`bg-white border border-gray-300 shadow-md rounded-md p-4 ${mode === 'light' ? 'light-theme' : 'dark-theme'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {post.user && (
                <img
                  src={
                    post.user.profileImage
                      ? `${imageLink}${post.user.profileImage}`
                      : post.user.gender === 'male'
                      ? defaultMaleImage
                      : post.user.gender === 'female'
                      ? defaultFemaleImage
                      : defaultCustomImage
                  }
                  alt={`${post.user.firstName} ${post.user.surname}`}
                  className="w-12 h-12 rounded-full mr-2 object-cover"
                />
              )}
              <div>
                {post.user && (
                  <div className="flex items-center gap-1">
                    <h1 className="font-bold">{post.user.firstName} {post.user.surname}</h1>
                    {post.user.vipToken === "iamgold" && <img src={goldTick} alt="gold" className="w-6 h-6" />}
                    {post.user.vipToken === "skyisblue" && <img src={blueTick} alt="blue" className="w-6 h-6" />}
                    <span>
                      {post.user.friends.length > 0 && (
                        post.user.friends.map((friend) => (
                          friend === userInfo.id && <img className="w-4 h=4" src="https://cdn-icons-png.flaticon.com/512/880/880594.png" alt="friend" />
                        ))
                      )}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-500">{formatDateDifference(formatDate(post.createdAt))} • 🌐</p>
              </div>
            </div>
          </div>
          <p className="text-lg mb-2 text-gray-700 italic">{post.caption}</p>
          <img 
            src={`${imageLink}${post.image}`}
            alt={post.caption} 
            className="object-cover mb-2 rounded-md h-96 w-full"
          />
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
              <Link to={`/post/${post._id}`} className="text-blue-500 hover:text-blue-700 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>

              </Link>
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
              value={comment}
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
  )}

  {posts.length === 0 && !loading && <p className="text-center mt-4 text-gray-500">No posts available.</p>}

  {loading && <div className="flex items-center justify-center mt-4"><div className="lds-circle"><div></div></div></div>}
</div>


  );
}
