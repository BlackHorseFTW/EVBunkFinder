import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing">
      <div className="landing__options">
        <h1 className="landing_heading">EVBUNKFINDER V1.0</h1>
        <Link to="/admin/login" className="landing__option">Admin</Link>
        <Link to="/user/login" className="landing__option">User</Link>
      </div>
    </div>
  );
}

export default Landing;
