import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post("https://zenfit-server.onrender.com/api/auth/register", { name, email, password });
      const user = res.data;

      localStorage.setItem("zenfitUser", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      alert("Registration successful!");
      navigate("/personal-details");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container text-center">
      <h1 className="title">ZENFIT</h1>
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Name"
        className="form-control my-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        className="form-control my-2" //className="btn-grad" btn btn-primary
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-grad" onClick={handleRegister}>Register</button>
      <p className="mt-2">
        Already have an account? <a href="/login" className="register-link">Login</a>
      </p>
    </div>
  );
};

export default Register;
