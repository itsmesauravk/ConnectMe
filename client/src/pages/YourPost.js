import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleString('en-US', options);
}

const defaultMaleImage = "https://www.w3schools.com/howto/img_avatar.png";
const defaultFemaleImage = "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png";
const defaultCustomImage = "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg";

export default function YourPost({mode}) {
  // const { userInfo } = useContext(UserContext);
  const userInfo = JSON.parse(localStorage.getItem("user"));  
  const userId = userInfo.id;
  const [posts, setYourPosts] = useState([]);
  const [postId, setPostId] = useState("");
  const [editPostId, setEditPostId] = useState("");
  const [caption,setCaption] = useState("")
  const [image,setImage] = useState(null)

  // const [delPost,setDelPost] = useState(false)

  const [loading, setLoading] = useState(false);


  // const [editRedirect,setEditRedirect] = useState(false)

 

  const showUserPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/yourpost/${userId}`);
      const data = response.data;
      setYourPosts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    showUserPosts();
  }, [userId]); 

  // Delete post (not working currently)
  const deletePost = async () => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      try {
        const response = await axios.delete(`http://localhost:4000/deletepost/${postId}`);
        const data = response.data;
        console.log("Post deleted:", data);
        showUserPosts();
        setPostId("");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    
  };


  // useEffect(()=>{
  //     setPostId("");
  // }, [postId])



  const updateEditPost = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData()
        formData.append("caption",caption)
        formData.append("image",image)
        const response = await axios.patch(`http://localhost:4000/updatepost/${editPostId}`, 
            formData
        );
        // console.log(response);
        
        if (response.status === 200) {
            console.log("Post Updated");
            setEditPostId("");
          
            showUserPosts();
        } else {
            alert("Post not Updated");
        }
    } catch (error) {
        console.error("Error updating post:", error);
    }
};


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

      setYourPosts((prevPosts) =>
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

// if(editRedirect){
//   return <Navigate to={`/yourpost/${userId}`} />
// }
  const imageLink = "http://localhost:4000/"
  const blueTick = "https://upload.wikimedia.org/wikipedia/commons/3/32/Verified-badge.png";
  const goldTick = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2048px-Twitter_Verified_Badge_Gold.svg.png";


  return (
    <div>
   
      <div className={`bg-white border border-gray-300 shadow-md rounded-md p-4 bg-purple-200 ${mode === 'light'?'light-color-theme':'dark-color-theme'}`}>
            <div className="flex items-center mb-4">
              {userInfo && (
                <img 
                  src={
                    userInfo.profileImage
                      ? imageLink + userInfo.profileImage
                      : userInfo.gender === 'male'
                      ? defaultMaleImage
                      : userInfo.gender === 'female'
                      ? defaultFemaleImage
                      : defaultCustomImage
                  }
                  alt={`${userInfo.firstName} ${userInfo.surname}`}
                  style={{ width: '7rem', height: '7rem' }} 
                  className="rounded-md mr-2 object-cover"
                />
              )}
            <div>
            <div className="flex gap-1 items-center ">
              <h1 className="font-bold text-3xl ml-3">{userInfo.firstName} {userInfo.surname}</h1>
              {userInfo.vipToken === "iamgold" && <img src={goldTick} alt="gold" className="w-6 h-6" />}
              {userInfo.vipToken === "skyisblue" && <img src={blueTick} alt="blue" className="w-6 h-6" />}
            </div>
            {posts.length > 0 && posts[0].user.dateOfBirth ? (
              <p className="text-xs text-purple-800 ml-3">{formatDate(posts[0].user.dateOfBirth)}</p>
            ) : (
              <p>No date of birth available.</p>
            )}
          </div>
        </div>
        <p className="text-sm text-green-700 font-bold">Email: {userInfo.email}</p>
        <p className="text-sm text-gray-600 font-bold">Gender: {userInfo.gender}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button className=" text-sm bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-full ">
          <Link to={`/home`}>Home</Link>
        </button>
        <button className="text-sm bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-full ">
          <Link to={`/newpost/${userId}`}>Add New Post</Link>
        </button>
        <button className="text-sm bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-full ">
          <Link to={`/profilesetting/${userId}`}>Edit Profile</Link>
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-3 mt-3">Your Posts:</h1>
      {/* edit Div */}
      {editPostId  && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 `}>
          <div className={`bg-white p-8 rounded-md shadow-md text-center w-96 ${mode === 'light'?'light-theme':'dark-theme'}`}>
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-semibold">Edit post</h2>
              <button
                className="text-sm bg-red-600 hover:bg-red-800 text-white font-semibold h-7 py-1 px-2 rounded-md"
                onClick={() => setEditPostId(null)}
              >
                Close
              </button>
            </div>
            <form>
              <label htmlFor="caption" className="block text-gray-600 text-sm font-bold mb-2">
                Caption
              </label>
              <input
                type="text"
                name="caption"
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`border border-gray-300 shadow-md rounded-md p-2 mb-4 w-full ${mode === 'light'?'light-theme':'dark-theme'}`}
              />
        
              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-600 text-sm font-bold mb-2">
                  Image
                </label>
                {image && (
                  <div className="mb-2">
                    <img
                      alt="Preview"
                      width={250}
                      className="rounded-md mb-2"
                      src={URL.createObjectURL(image)}
                    />
                    <br />
                    <button
                      className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-1 px-2 rounded-full"
                      onClick={() => setImage(null)}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  name="updatedImage"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    setImage(file);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
        
              <button
                className="text-sm bg-purple-600 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-full"
                onClick={updateEditPost}
              >
                Update Post
              </button>
            </form>
          </div>
        </div>
      )}
      {/* delete Div */}
      {postId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`bg-white p-8 rounded-md shadow-md text-center ${mode === 'light'?'light-theme':'dark-theme'}`}>
              <p className="text-lg font-semibold mb-4">Do you really want to Delete?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-full"
                  onClick={()=>setPostId("")}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full"
                  onClick={deletePost}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>        
      
      )}

      {posts.length > 0 && (
        <div>
          <div className="flex flex-col gap-8 mt-5 relative">
            {posts.map((post) => (
              <div key={post._id} className={`bg-white border border-gray-300 shadow-md rounded-md p-4 relative ${mode === 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center mb-4">
                  <img
                  src={
                    userInfo.profileImage
                      ? imageLink + userInfo.profileImage
                      : userInfo.gender === 'male'
                      ? defaultMaleImage
                      : userInfo.gender === 'female'
                      ? defaultFemaleImage
                      : defaultCustomImage
                  }
                  alt={`${userInfo.firstName} ${userInfo.surname}`}
                  style={{ width: '3rem', height: '3rem' }} 
                  className="rounded-full mr-2 object-cover"
                />
                    <div>
                      <div className="flex gap-1 items-center ">
                          <h1 className="font-bold">{userInfo.firstName} {userInfo.surname}</h1>
                          {userInfo.vipToken === "iamgold" && <img src={goldTick} alt="gold" className="w-6 h-6" />}
                          {userInfo.vipToken === "skyisblue" && <img src={blueTick} alt="blue" className="w-6 h-6" />}
                      </div>
                      <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                      
                    </div>
                  </div>
                  {userInfo.id === post.user._id && (
                    <div className="flex gap-4">
                      <button
                        className="ml-auto text-xs text-blue-500 font-bold hover:text-blue-800"
                        onClick={() => setEditPostId(post._id)}
                      >
                        Edit
                      </button>

                      <button
                        className="ml-auto text-xs text-red-500 font-bold hover:text-red-800"
                        onClick={() => setPostId(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-lg mb-2  text-gray-700 italic">
                  {post.caption}
                </p>

                <img 
                  src={imageLink + post.image}
                  alt={post.caption} 
                  style={{ width: '300px', height: '350px' }}
                  className="object-cover mb-2 rounded-md"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && !loading && <p>No posts available.</p>}

      {loading && <div className="lds-circle"><div></div></div>}
    </div>
  );
}

