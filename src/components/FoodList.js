
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Step 1: Import

const FoodList = () => {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("");
  const [foodItems, setFoodItems] = useState([]);

  const user = JSON.parse(localStorage.getItem("zenfitUser"));
  const userId = user?._id;

  const navigate = useNavigate(); // ✅ Step 2: Initialize

  const handleLogout = () => {
    localStorage.removeItem("zenfitUser");
    localStorage.removeItem("userId");
    navigate("/login");
  };
  

  const handleAddFood = async () => {
    if (!foodName || !calories || !mealType) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://zenfit-server.onrender.com/api/foodlist/add", {
        userId,
        foodName,
        calories,
        mealType,
      });

      alert(res.data.message);
      setFoodName("");
      setCalories("");
      setMealType("");
      fetchFoodItems(); // Refresh list
    } catch (err) {
      console.error(err);
      alert("Error adding food item");
    }
  };

  const fetchFoodItems = async () => {
    try {
      const res = await axios.get(`https://zenfit-server.onrender.com/api/foodlist/${userId}`);
      setFoodItems(res.data.foodItems || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!userId) {
      alert("Please log in");
      window.location.href = "/login";
    } else {
      fetchFoodItems();
    }
  }, [userId]);

  return (
    <div className="container text-center">
      <h2>Add Custom Food Items</h2>
      <input
        type="text"
        placeholder="Food Name"
        className="form-control my-2"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Calories"
        className="form-control my-2"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />
      <select
        className="form-control my-2"
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        <option value="">Select Meal Type</option>
        <option value="breakfast">Breakfast</option>
        <option value="brunch">Brunch</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="snack">Snack</option>
      </select>
      <button className="btn btn-primary" onClick={handleAddFood}>
        Add Food Item
      </button>

      <hr />
      <h4>Your Saved Food Items</h4>
      {foodItems.map((item, index) => (
        <div key={index} className="card my-2 p-2">
          <strong>{item.foodName}</strong> – {item.calories} cal ({item.mealType})
        </div>
      ))}

      {/* ✅ Step 3: Back to Daily Logs Button */}
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/daily-logs")}>
        ⬅️ Back to Daily Logs
      </button>

      <button className="btn btn-danger mt-3" onClick={handleLogout}>
        🚪 Logout
      </button>


    </div>
  );
};

export default FoodList;
