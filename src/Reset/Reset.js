import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../firebase/firebase";
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth); // Removed unused 'error' variable
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading, navigate]); // Added 'navigate' to the dependency array

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button className="reset__btn" onClick={() => sendPasswordReset(email)}>
          Send password reset email
        </button>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Reset;
