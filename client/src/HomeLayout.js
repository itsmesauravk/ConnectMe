import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { UserContext } from "./UserContext";
import axios from "axios";



//inside homelayout userBOx and navbar layout


const defaultMaleImage = "https://www.w3schools.com/howto/img_avatar.png";
const defaultFemaleImage = "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/11_avatar-512.png";
const defaultCustomImage = "https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small/user-profile-icon-free-vector.jpg";
const blueTick = "https://upload.wikimedia.org/wikipedia/commons/3/32/Verified-badge.png";
const goldTick = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Twitter_Verified_Badge_Gold.svg/2048px-Twitter_Verified_Badge_Gold.svg.png";
// const goldTick2 = "https://seeklogo.com/images/T/twitter-verified-badge-gold-logo-48439DE18B-seeklogo.com.png";

const url = "http://localhost:4000";

export default function HomeLayout({mode}){
    const [redirect,setRedirect] = useState(false)
    // const { userInfo,ready } = useContext(UserContext)
    const [userLogout,setUserLogout] = useState(false)
    const userInfo = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
   

    const [notificationCount, setNotificationCount] = useState(0);

    //for scrolling to top of page
        const scrollToTop = () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth', // You can change this to 'auto' for instant scrolling
          });
        };
    

    

    function logout(){
        
        try{
            fetch(`${url}/logout`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
            }).then((res)=>{
            if(res.status === 200){
                console.log("User Logout");
                setRedirect(true)
                // localStorage.removeItem("user");
                
            }else{
                alert("User not Logout");
            }
            })
        }catch(err){
            console.log(err);
        }
    }
    


  useEffect(() => {
    const showNotificationFriends = async () => {
      try {
          const response = await fetch(`${url}/show-recieved-friend-requests?receiverId=${userInfo.id}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          
          if(data.success){
            setNotificationCount(data.notifications.length)
          }
      } catch (error) {
          console.log("Error showing notifications: ", error);
      }
  }
    showNotificationFriends();
  }, [userInfo.id]);

    if(redirect){
        return <Navigate to="/"/>  // /-> login page
    }
    // if (!ready) {
    //     // Data is still being fetched, show loading state or return null
    //     return <p>Loading...</p>;
    //   }
    if (!userInfo) {
        // You can render a loading state or return null
        return null;
      }
    //   console.log("User Info :",userInfo)
    const {id,firstName,surname,email,gender,profileImage} = userInfo;
    const imageLink = "http://localhost:4000/"
    // login info => userInfo 
    return(
        <div>
            <div className={`flex justify-between pl-5 pr-10 items-center mt-5 bg-purple-100 p-2 rounded-md ${mode === 'light'? 'light-color-theme':'dark-color-theme'}`}>  
                <div className="flex  items-center gap-3">
                    <div >
                        {profileImage && <img src={imageLink+profileImage} alt="profile" className="w-20 h-20 rounded-full object-cover" />}
                        {!profileImage && gender === 'male' &&
                            <img src={defaultMaleImage} alt="male-profile" className="w-20 h-20 rounded-full" />
                        }
                        {!profileImage && gender === 'female' &&
                            <img src={defaultFemaleImage} alt="female-profile" className="w-20 h-20 rounded-full" />
                        }
                        {!profileImage && gender === 'custom' &&
                            <img src={defaultCustomImage} alt="custom-profile" className="w-20 h-20 rounded-full" />
                        }
                    </div>
                    <div>
                        <div className="flex gap-1 items-center ">
                            <h1 className="font-bold">{firstName} {surname}</h1>
                            {userInfo.vipToken === "iamgold" && <img src={goldTick} alt="gold" className="w-6 h-6" />}
                            {userInfo.vipToken === "skyisblue" && <img src={blueTick} alt="blue" className="w-6 h-6" />}
                        </div>
                        
                        <p className="text-sm italic text-blue-800 underline">{email}</p>
                    </div>
                </div>

                        {/* notifications  */}
                <div className="relative">
                    <Link to={'/notification'}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                      </svg>
                      {notificationCount >0 ?
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {notificationCount}
                        </span>
                      :null}
                    </Link>
                </div>
            </div>
            <nav className="bg-purple-600 p-4 mt-6 rounded-md sticky top-1 p-4 text-white">
                <ul className=" flex space-x-4 justify-around">
                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        <Link className="navItems homenav" to={'/home'} onClick={scrollToTop}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        </Link>

                    </li>
                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        {/* Friends  */}
                        <Link className="navItems friends" to={`/home/friends `}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                        </svg>
                        </Link>

                    </li>

                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        {/* Other users  */}
                        <Link className="navItems users" to={`/home/users`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        </Link>

                    </li>
                    
                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        {/* profile  */}
                        <Link className="navItems profile" to={`/yourpost/${id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>

                        </Link>
 
                        </li>

                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">

                        {/* Add new Post  */}

                        <Link className="navItems newpost" to={`/newpost/${id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        </Link>

                    </li>

                    

                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        {/* edit Porfile  */}
                        <Link className="navItems editProfile" to={`/profilesetting/${id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                        </Link>

                        </li>

                    <li className="text-white font-bold hover:text-gray-300 cursor-pointer">
                        {/* logout  */}
                    <Link className="navItems logout" onClick={()=>setUserLogout(true)} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>
                    
                    </Link>

                        </li>
                </ul>
            </nav>
            {userLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className={`bg-white p-8 rounded-md shadow-md text-center ${mode === 'light' ? 'light-theme':'dark-theme'}`}>
                  <p className="text-lg font-semibold mb-4">Do you really want to logout?</p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-full"
                      onClick={()=>setUserLogout(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>              
            )}
            

            <Outlet />
        </div>
    )
}
