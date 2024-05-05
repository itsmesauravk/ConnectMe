
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import '../App.css'



const urlApi = "https://connect-us-api.vercel.app"


export default function LoginPage({mode}) {  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect,setRedirect] = useState(false)
    const [loading,setLoading] = useState(false)
    // const [userId,setUserId] = useState("")
    const {setUserInfo} = useContext(UserContext)

    const [emptyError,setEmptyError] = useState(false)
    const [invalidCredentials,setInvalidCredentials] = useState(false)
    const [otherError,setOtherError] = useState(false)

    function loginUser(ev) {
        ev.preventDefault();
        setLoading(true);
        setEmptyError(false);
        setInvalidCredentials(false);
        setOtherError(false);
    
        // Check for empty email or password
        if (!email || !password) {
            setLoading(false);
            // alert("Please enter both email and password.");
            setEmptyError(true);
            return;
        }
    
        fetch(`${urlApi}/login`, {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        }).then((res) => {
            if (res.status === 200) {
                console.log("User Login");
                res.json().then((data) => {
                    setRedirect(true);
                    setUserInfo(data);
                    localStorage.setItem("user", JSON.stringify(data));
                });
            } else {
                // alert("Invalid email or password");
                setInvalidCredentials(true);
                redirect(false);
            }
        }).catch((error) => {
            console.error("Error during login:", error);
            // alert("An error occurred during login. Please try again.");
            setOtherError(true);
        }).finally(() => {
            setLoading(false);
        });
    }
    
    
    if (redirect) {
        return <Navigate to={`/home`} />;
      }
    


      return (
        <div className="flex justify-center items-center mt-10">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <form className="space-y-4" onSubmit={loginUser}>
              <label className="block">
                Email:
                <input
                  className="block border border-gray-300 rounded-md p-2 w-full"
                  type="text"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label className="block">
                Password:
                <input
                  className="block border border-gray-300 rounded-md p-2 w-full"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
      
              {emptyError && <p className="text-red-600">Please enter both email and password.</p>}
              {invalidCredentials && <p className="text-red-600">Invalid email or password.</p>}
              {otherError && <p className="text-red-600">An error occurred during login. Please try again.</p>}
      
              {loading ? (
                <div className="flex justify-center">
                  <div className="lds-circle"><div></div></div>
                </div>
              ) : (
                <button className="bg-blue-500 text-white rounded-md py-2 px-4 w-full" type="submit">Login</button>
              )}
            </form>
      
            <div className="mt-4 text-center">
              <p>Don't have an account? <Link className="text-blue-500 underline" to="/registration">Create One</Link></p>
            </div>
          </div>
        </div>
      );
      
}