import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Navigate } from "react-router-dom";



const urlApi = "http://localhost:4000";

export default function Notification() {
  const { userInfo } = useContext(UserContext);
  // const userInfo = localStorage.getItem("user")
  
  const [redirect, setRedirect] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [reqSenderId, setReqSenderId] = useState("");

 


 const showNotificationFriends = async () => {
    try {
        const response = await fetch(`${urlApi}/show-recieved-friend-requests?receiverId=${userInfo.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data.notifications);
        if(data.success){
          setNotificationData(data);
        }
    } catch (error) {
        console.log("Error showing notifications: ", error);
    }
}

//cancel request that is recieved

  const cancelReceivedRequest = async(senderId) =>{
    
    try {
      const response = await axios.post(`${urlApi}/reject-recieved-request`, {
        senderId: senderId,
        receiverId: userInfo.id
      });
      console.log(response.data);
      if(response.data.success){
        showNotificationFriends();
      }
    } catch (error) {
      console.log("Error cancelling request: ", error);
    }
  }

  useEffect(() => {
    showNotificationFriends();
  }, []);


  if (redirect) {
    return <Navigate to="/home" />;
  }

   //accepting the friend request
   const acceptRequest = async (senderId) => {
    try {
        
        const response = await axios.post(`${urlApi}/accept-request`, {
            senderId: senderId,
            receiverId: userInfo.id
        });
        console.log(response.data);
        if(response.data.success){
            
        }
    } catch (error) {
        console.log("Error accepting request: ", error.response || error.message || error);
    } 
}

  if(reqSenderId){
    acceptRequest();
  }

  // console.log("noti", notificationData);
 

  return (
    <div>
      <div>
        <button
          onClick={() => setRedirect(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Home
        </button>
      </div>
    
      <h1
      className="text-3xl font-bold mt-5 mb-5"
      >
        Notifications
        </h1>
        <button className="bg-green-600 p-2 font-bold text-white rounded" onClick={()=>showNotificationFriends()}>Refresh</button>
      <div>
        {notificationData.notifications && notificationData.notifications.length > 0 ? (
          notificationData.notifications.map((notification) => (
            <div
              key={notification._id}
              className="flex justify-between border-2 p-2.5 rounded-md mt-5"
            >
              <div className="flex gap-3">
                <img
                  src={urlApi + "/" + notification.senderId.profileImage}
                  alt="user"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h1 className="font-bold">{notification.senderId.firstName} {notification.senderId.surname}</h1>
                  <h1 className="italic text-gray-500">{notification.content}</h1>
                </div>
              </div>
                <div className="flex gap-1 align-center justify-center">
                {notification.status ? (
                  <p className="font-bold text-green-600">Friends</p>
                  ):(
                    <div>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={()=>{acceptRequest(notification.senderId._id)}}
                        >
                          Accept
                        </button>
            
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={()=>cancelReceivedRequest(notification.senderId._id)}
                        >
                          Reject
                        </button>

                    </div>
                  )}
              </div>

             
            </div>
          ))
        ) : (
          <p>No notifications found</p>
        )}
      </div>
    </div>
  );
}
