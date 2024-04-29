import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../UserContext';




const WatchComments = ({ mode }) => {
    const { userInfo } = useContext(UserContext);
    const { postId } = useParams();

    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState("");
    const [posts, setPosts] = useState([]);


    // Handle like for the single post
    const handleLike = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/post-like`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: post._id, userId: userInfo.id }),
                credentials: "include",
            });

            if (response.status === 200) {
                const updatedPost = { ...post }; // Clone the post object
                updatedPost.likes = updatedPost.likes.includes(userInfo.id)
                    ? updatedPost.likes.filter((userId) => userId !== userInfo.id) // Remove like if already liked
                    : [...updatedPost.likes, userInfo.id]; // Add like if not liked

                setPost(updatedPost); // Update the post state
            } else {
                alert("Like failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle comment for the single post
    const handleComment = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:4000/post-comment`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: post._id, userId: userInfo.id, comment }),
                credentials: "include",
            });

            if (response.status === 200) {
                const updatedPost = { ...post }; // Clone the post object
                updatedPost.comments = [...updatedPost.comments, userInfo.id]; // Add the new comment ID

                setPost(updatedPost); // Update the post state
                setComment(""); // Clear the comment input
                fetchPost();
            } else {
                alert("Comment failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
      

    async function fetchPost() {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:4000/post/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (response.status === 200) {
                    const data = await response.json();
                    setPost(data.post); // Set the fetched post
                } else {
                    alert("Post not found");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

    useEffect(() => {
        fetchPost();
    }, []);

    return (
        <div>
            <div>
                <Link to="/home" className="text-blue-500 hover:text-blue-700">Back to posts</Link>
            </div>
            {post && (
                <div className={`bg-white border border-gray-300 shadow-md rounded-md p-4 ${mode === 'light' ? 'light-theme' : 'dark-theme'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    {/* User details */}
                                </div>
                                <p className="text-lg mb-2 text-gray-700 italic">{post.caption}</p>
                                <img
                                    src={`http://localhost:4000/${post.image}`}
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
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        className="w-full border border-gray-300 rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500 transition duration-300"
                        
                        />
                        <button className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition duration-300"
                        onClick={()=>handleComment(post._id)}
                        >Comment</button>
                    </div>

                        {/* for displaying all comments  */}
                    <div>  
                        {post.comments && post.comments.map((comment) => (
                            <div className="flex items-center mt-4">
                                <img
                                    src={`http://localhost:4000/${comment.profileImage}`}
                                    alt={comment.firstName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <p className="ml-2 text-gray-700">{comment.comment}</p>
                            </div>
                        ))}   
                    </div>
                   
                </div>
            
            )}

            {!post && !loading && <p className="text-center mt-4 text-gray-500">Post not found.</p>}

            {loading && <div className="flex items-center justify-center mt-4"><div className="lds-circle"><div></div></div></div>}
        </div>
    );
}

export default WatchComments;
