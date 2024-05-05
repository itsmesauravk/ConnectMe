import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

const url = "https://connect-us-api.vercel.app";

export default function FriendsPage() {
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [allFriends, setAllFriends] = useState([]);

  const showFriends = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${url}/show-friends?userId=${userInfo.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.friends);
      if (data.success) {
        setAllFriends(data.friends);
      }
    } catch (error) {
      console.log("Error showing notifications: ", error);
    } finally {
      setLoading(false);
    }
  }


  const removeFromFriend = async(friendId)=>{
      try {
        setLoading(true)
        const response = await fetch(`${url}/remove-friend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userInfo.id,
            friendId: friendId
          })
        });
        const data = await response.json();
        console.log(data);
        if(data.success){
          showFriends();
        }else{
          alert(data.message)
        }
      } catch (error) {
        console.log(error)
        
      }finally{
        setLoading(false)
      }
  }

  
  useEffect(() => {
    showFriends();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {allFriends.length === 0 ? (
            <p>No friends found.</p>
          ) : (
            <ul>
              <h1 className="text-2xl font-bold mb-4 mt-4">Friends ({allFriends.length})</h1>
              {allFriends.map((friend) => (
                <li key={friend._id}>
                  <div className="flex justify-between items-center bg-white shadow-lg rounded-lg p-4 mb-1 mt-3">
                    <div className="flex items-center space-x-4">
                      <img className="w-16 h-16 rounded-full" src={`${url}/${friend.profileImage}`} alt="Profile" />
                      <div>
                        <p className="text-xl font-semibold">{friend.firstName} {friend.surname}</p>
                        <p className="text-blue-600">{friend.email}</p>
                        
                      </div>
                    </div>
                    <div>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                        onClick={()=>removeFromFriend(friend._id)}
                      >Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
