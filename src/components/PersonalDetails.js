
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PersonalDetails = () => {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("zenfitUser"));
  const userId = user?._id;

  const handleLogout = () => {
    localStorage.removeItem("zenfitUser");
    navigate("/login");
  };

  useEffect(() => {
    if (!userId) {
      alert("You're not logged in");
      navigate("/login");
    } else {
      (async () => {
        try {
          const res = await axios.get(`https://zenfit-server.onrender.com/api/personal/${userId}`);
          const details = res.data.details;
          if (details) {
            // If data exists, set it to input fields
            setFullName(details.name || "");
            setAge(details.age || "");
            setGender(details.gender || "");
            setHeight(details.height || "");
            setWeight(details.weight || "");
          }
        } catch (err) {
          console.error("Error fetching personal details", err);
        }
      })();
    }
  }, [userId, navigate]);

  const handleSubmit = async () => {
    if (!fullName || !age || !gender || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    if (age < 0 || height < 0 || weight < 0) {
      alert("Age, height, and weight must be positive");
      return;
    }

    try {
      const res = await axios.post("https://zenfit-server.onrender.com/api/personal/save", {
        userId,
        fullName,
        age,
        gender,
        height,
        weight,
      });

      alert(res.data.message);
    } catch (error) {
      console.error("❌ Failed to save:", error);
      alert(error.response?.data?.message || "Error saving details");
    }
  };

  const goToDailyLogs = () => {
    navigate("/daily-logs");
  };

  return (
    <div className="container text-center">
      <h1 className="title">ZENFIT</h1>
      <h3 className="welcome-message">Hey {user?.name}, Welcome to ZenFit!!</h3>

      <input
        type="text"
        placeholder="Full Name"
        className="form-control my-2"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Age"
        className="form-control my-2"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        min="0"
      />
      <select
        className="form-control my-2"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">{gender ? gender : "Select Gender"}</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Height (cm)"
        className="form-control my-2"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        min="0"
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        className="form-control my-2"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        min="0"
      />

      <button className="btn btn-success my-2" onClick={handleSubmit}>
        Save Details
      </button>
      <button className="btn btn-primary my-2" onClick={goToDailyLogs}>
        Go to Daily Logs
      </button>
      <button className="btn btn-danger my-2" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default PersonalDetails;
