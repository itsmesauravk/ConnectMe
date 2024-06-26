import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
// import MainPage from './pages/MainPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout'; 
import HomePage from './pages/HomePage';
import HomeLayout from './HomeLayout';
import { UserContextProvider } from './UserContext';
import NewPostPage from './pages/NewPostPage';
import YourPost from './pages/YourPost';
import ProfileSetting from './pages/ProfileSetting';
import UsersPage from './pages/UsersPage';
import InspectUserPage from './pages/InspectUserPage';
import FriendsPage from './pages/FriendsPage';
import Notification from './pages/Notification';
import WatchComments from './pages/WatchComments';

function App() {
  const [theme,setTheme] = useState("light");

  const toggleMode = () => {
    setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
  };
  
  


  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout mode={theme} toggleMode={toggleMode}/>}>
          <Route path='/' element={<LoginPage mode={theme}/>} />
          <Route path='/registration' element={<RegistrationPage mode={theme}/>} />

          <Route path='/home' element={<HomeLayout mode={theme}/>}>
            <Route path="/home" element={<HomePage mode={theme}/>} />
            <Route path='/home/users' element={<UsersPage/>} />
            <Route path='/home/friends' element={<FriendsPage/>} />
          </Route>
          {/* <Route path='/users' element={<UsersPage/>} /> */}
          <Route path='/newpost/:userId' element={<NewPostPage mode={theme}/>} />
          <Route path='/yourpost/:userId' element={<YourPost mode={theme}/>} />
          <Route path='/profilesetting/:userId' element={<ProfileSetting mode={theme}/>} />
          <Route path='/inspectuser/:userId' element={<InspectUserPage mode={theme}/>} />
          
          <Route path='/notification' element={<Notification mode={theme}/>} />
          <Route path='/post/:postId' element={<WatchComments mode={theme}/>} />

        </Route>
      </Routes>

    </UserContextProvider>
  );
}

export default App;
