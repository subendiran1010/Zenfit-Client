// client/src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import PersonalDetails from "./components/PersonalDetails";
import DailyLogs from "./components/DailyLogs"; // ✅
import HealthGoals from "./components/HealthGoals";
import Progress from "./components/Progress";
import FoodList from "./components/FoodList";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  const [userLogs, setUserLogs] = useState([]);
  const [healthGoals, setHealthGoals] = useState({
    steps: 0,
    water: 0,
    calories: 0
  });

  const [customFoodItems, setCustomFoodItems] = useState({
    breakfast: {},
    brunch: {},
    lunch: {},
    dinner: {},
    snack: {},
  });

  const addFoodItem = (category, name, calories) => {
    setCustomFoodItems((prevItems) => ({
      ...prevItems,
      [category]: {
        ...prevItems[category],
        [name]: Number(calories),
      },
    }));
  };

  // ✅ Get userId from localStorage
  const userId = localStorage.getItem("userId");

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App functionality routes */}
        <Route path="/personal-details" element={<PersonalDetails userId={userId} />} />
        <Route
          path="/daily-logs"
          element={
            <DailyLogs
              userLogs={userLogs}
              setUserLogs={setUserLogs}
              customFoodItems={customFoodItems}
            />
          }
        />
        <Route
          path="/health-goals"
          element={<HealthGoals setHealthGoals={setHealthGoals} />}
        />
        <Route
          path="/progress"
          element={<Progress userLogs={userLogs} healthGoals={healthGoals} />}
        />
        <Route
          path="/food-list"
          element={<FoodList addFoodItem={addFoodItem} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
