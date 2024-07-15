import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Landing from "./Landing/Landing";
import AdminLogin from "./Login/AdminLogin";
import UserLogin from "./Login/UserLogin";
import AdminRegister from "./Register/AdminRegister";
import UserRegister from "./Register/UserRegister";
import AdminDashboard from "./Dashboard/AdminDashboard";
import UserDashboard from "./Dashboard/UserDashboard";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin userType="admin" />} />
          <Route path="/admin/register" element={<AdminRegister userType="admin" />} />
          <Route path="/user/login" element={<UserLogin userType="user" />} />
          <Route path="/user/register" element={<UserRegister userType="user" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
