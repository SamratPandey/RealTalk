import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateSpace from "./pages/CreateSpace";
import JoinSpace from "./pages/JoinSpace";
import SpaceDetails from "./pages/SpaceDetails"; 
import ProfileUpdate from "./pages/ProfileUpdate"; 
import { useAuth } from "./authContext";

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />  

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route
        path="/create-space"
        element={user ? <CreateSpace /> : <Navigate to="/login" />}  
      />
      <Route
        path="/join-space"
        element={user ? <JoinSpace /> : <Navigate to="/login" />} 
      />
      <Route
        path="/space/:id"
        element={user ? <SpaceDetails /> : <Navigate to="/login" />} 
      />
      <Route
        path="/update-profile"
        element={user ? <ProfileUpdate/> : <Navigate to="/login" />} 
      />
    </Routes>
  );
};

export default App;
