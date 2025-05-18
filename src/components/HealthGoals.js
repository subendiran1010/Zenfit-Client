
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HealthGoals = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("zenfitUser"));
  const userId = user?._id;

  const [stepGoal, setStepGoal] = useState("");
  const [waterGoal, setWaterGoal] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("zenfitUser");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  

  const handleSaveGoals = async () => {
    try {
      await axios.post("https://zenfit-server.onrender.com/api/healthgoals/save", {
        userId,
        steps: stepGoal,
        water: waterGoal,
        calories: calorieGoal,
      });
      alert("✅ Goals saved successfully!");
      navigate("/progress");
    } catch (err) {
      console.error("❌ Error saving health goals:", err);
      alert("❌ Failed to save goals.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Set Your Health Goals 🏁</h2>

      <div className="mb-3">
        <label>Step Goal:</label>
        <input
          type="number"
          className="form-control"
          value={stepGoal}
          onChange={(e) => setStepGoal(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Water Goal (liters):</label>
        <input
          type="number"
          className="form-control"
          value={waterGoal}
          onChange={(e) => setWaterGoal(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label>Calorie Goal (kcal):</label>
        <input
          type="number"
          className="form-control"
          value={calorieGoal}
          onChange={(e) => setCalorieGoal(e.target.value)}
        />
      </div>

      <button className="btn btn-primary mt-3" onClick={handleSaveGoals}>
        Save Goals 🎯
      </button>
      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        🚪 Logout
      </button>

    </div>
  );
};

export default HealthGoals;
