
// src/components/DailyLogs.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const mealTypes = ["breakfast", "brunch", "lunch", "dinner", "snack"];

const DailyLogs = () => {
  const user = JSON.parse(localStorage.getItem("zenfitUser"));
  const userId = user?._id;
  const navigate = useNavigate();

  const [stepCount, setStepCount] = useState("");
  const [waterCups, setWaterCups] = useState("");
  const [activity, setActivity] = useState("");
  const [foodLogs, setFoodLogs] = useState({
    breakfast: "",
    brunch: "",
    lunch: "",
    dinner: "",
    snack: ""
  });
  const [foodOptions, setFoodOptions] = useState({
    breakfast: [],
    brunch: [],
    lunch: [],
    dinner: [],
    snack: []
  });

  // 🔵 State to store watch ID
  const [watchId, setWatchId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("zenfitUser");
    navigate("/login");
  };

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await axios.get(`https://zenfit-server.onrender.com/api/foodlist/${userId}`);
        const items = res.data.foodItems;

        const categorized = {
          breakfast: [],
          brunch: [],
          lunch: [],
          dinner: [],
          snack: []
        };

        items.forEach(item => {
          categorized[item.mealType].push({ name: item.foodName, calories: item.calories });
        });

        setFoodOptions(categorized);
      } catch (err) {
        console.error("Error fetching food items", err);
      }
    };

    fetchFoodItems();
  }, [userId]);

  const calculateTotalCalories = () => {
    return mealTypes.reduce((total, type) => {
      const selected = foodOptions[type].find(item => item.name === foodLogs[type]);
      return total + (selected?.calories || 0);
    }, 0);
  };

  const handleSubmit = async () => {
    if (stepCount < 0 || waterCups < 0) {
      alert("Values cannot be negative");
      return;
    }

    const totalCalories = calculateTotalCalories();

    try {
      await axios.post("https://zenfit-server.onrender.com/api/dailylogs/save", {
        userId,
        stepCount,
        waterIntake: waterCups / 4,
        activity,
        foodLogs,
        totalCalories
      });
      navigate("/health-goals");
      alert("✅ Daily log saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save daily log.");
    }
  };

  // ⭐ Updated function to track distance
  const handleTrackDistance = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // 1️⃣ First: Single location fetch
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        await axios.post("https://zenfit-server.onrender.com/api/dailylogs/track-location", {
          userId,
          latitude,
          longitude
        });
        alert("✅ Initial location tracked!");
      } catch (error) {
        console.error(error);
        alert("❌ Failed to track initial location.");
      }
    }, (error) => {
      console.error(error);
      alert("❌ Failed to get initial location.");
    }, { enableHighAccuracy: true });

    // 2️⃣ Then: Start continuous 
    const id = navigator.geolocation.watchPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        await axios.post("https://zenfit-server.onrender.com/api/dailylogs/track-location", {
          userId,
          latitude,
          longitude
        });
        console.log("📍  location updated:", latitude, longitude);
      } catch (error) {
        console.error("❌ Failed to save location:", error);
      }
    }, (error) => {
      console.error("❌ Error watch position:", error);
    }, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 });

    setWatchId(id); // Save watch ID if you want to stop later
  };

  // 🛑 Optional: Stop 
  const handleStopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      alert("📍 location stopped.");
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Daily Logs</h2>

      <div className="mb-3">
        <label>Step Count:</label>
        <input
          type="number"
          className="form-control"
          value={stepCount}
          onChange={(e) => setStepCount(e.target.value)}
          step="500"
          min="0"
          placeholder="Enter steps walked (e.g. 500, 1000)"
        />
      </div>

      <div className="mb-3">
        <label>Water Intake (cups):</label>
        <input
          type="number"
          className="form-control"
          value={waterCups}
          onChange={(e) => setWaterCups(e.target.value)}
          step="1"
          min="0"
          placeholder="e.g. 4 for 1 litre"
        />
        {waterCups && (
          <small className="form-text text-muted">
            That’s {(waterCups / 4).toFixed(2)} litre{(waterCups / 4) !== 1 ? "s" : ""} 💧
          </small>
        )}
      </div>

      <div className="mb-3">
        <label>Physical Activity:</label>
        <select className="form-control" value={activity} onChange={(e) => setActivity(e.target.value)}>
          <option value="">Select activity</option>
          <option value="Cycling">Cycling</option>
          <option value="Running">Running</option>
          <option value="Swimming">Swimming</option>
          <option value="Sports">Sports</option>
          <option value="Walking">Walking</option>
        </select>
      </div>

      {mealTypes.map(type => (
        <div className="mb-3" key={type}>
          <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
          <select
            className="form-control"
            value={foodLogs[type]}
            onChange={(e) => setFoodLogs(prev => ({ ...prev, [type]: e.target.value }))}
          >
            <option value="">Select food</option>
            {foodOptions[type]?.map((item, index) => (
              <option key={index} value={item.name}>
                {item.name} ({item.calories} cal)
              </option>
            ))}
          </select>
        </div>
      ))}

      <h5 className="mt-3">🔥 Total Calories: {calculateTotalCalories()} kcal</h5>

      <button className="btn btn-success mt-3 me-2" onClick={handleSubmit}>
        Save Daily Log
      </button>

      {/* ⭐ New Buttons for tracking */}
      <button className="btn btn-primary mt-3 me-2" onClick={handleTrackDistance}>
        Track Distance Covered 📍
      </button>

      {/* <button className="btn btn-warning mt-3 me-2" onClick={handleStopTracking}>
        Stop Location🛑
      </button> */}

      <button className="btn btn-secondary mt-3 me-2" onClick={() => navigate("/food-list")}>
        Go to Food List ➕🍱
      </button>

      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default DailyLogs;
