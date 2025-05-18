
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    try {
      const res = await axios.post("https://zenfit-server.onrender.com/api/auth/login", { email, password });
      const user = res.data;

      localStorage.setItem("zenfitUser", JSON.stringify(user)); // Save full user info
      localStorage.setItem("userId", user._id); // Save userId for later use

      alert("Login successful!");
      navigate("/personal-details");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container text-center">
      <h1 className="title">ZENFIT</h1>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="form-control my-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="form-control my-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-grad" onClick={handleLogin}>Login</button>
      <p className="mt-2">
        Don't have an account? <a href="/register"  className="register-link"  >Register</a>
      </p>
    </div>
  );
};

export default Login;
