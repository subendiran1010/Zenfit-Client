
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { jsPDF } from "jspdf";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom"; // 🔹 Added

const Progress = () => {
  const navigate = useNavigate(); // 🔹 Added
  const userId = localStorage.getItem("userId");
  const [goals, setGoals] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("zenfitUser");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const goalsRes = await axios.get(`https://zenfit-server.onrender.com/api/healthgoals/${userId}`);
        const logsRes = await axios.get(`https://zenfit-server.onrender.com/api/dailylogs/user/${userId}`);

        setGoals(goalsRes.data.goal);
        setLogs(logsRes.data.logs || []);
        setLoading(false);
        calculateMessage(goalsRes.data.goal, logsRes.data.logs[logsRes.data.logs.length - 1]);
      } catch (err) {
        console.error("❌ Error fetching progress:", err);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  const calculateMessage = (goal, latestLog) => {
    if (!goal || !latestLog) return;

    const stepsPerc = (latestLog.steps / goal.steps) * 100;
    const waterPerc = (latestLog.waterIntake / goal.water) * 100;
    const calorieIntake = Object.values(latestLog.foodIntake || {}).reduce((acc, curr) => acc + (curr?.calories || 0), 0);
    const caloriesPerc = (calorieIntake / goal.calories) * 100;

    const avg = ((stepsPerc + waterPerc + caloriesPerc) / 3).toFixed(0);

    setMessage(`You crushed ${avg}% of your goal today! 🚀`);
  };

  const getChartData = () => {
    return logs.map((log, i) => {
      const calorieIntake = Object.values(log.foodIntake || {}).reduce((acc, curr) => acc + (curr?.calories || 0), 0);
      return {
        name: `Day ${i + 1}`,
        Steps: log.steps,
        Water: log.waterIntake,
        Calories: calorieIntake,
      };
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Your Progress Report", 20, 20);

    let yPosition = 30;
    logs.forEach((log, i) => {
      const calorieIntake = Object.values(log.foodIntake || {}).reduce((acc, curr) => acc + (curr?.calories || 0), 0);
      doc.text(`Day ${i + 1}: Steps - ${log.steps}, Water - ${log.waterIntake} cups, Calories - ${calorieIntake}`, 20, yPosition);
      yPosition += 10;
    });

    doc.save("progress_report.pdf");
  };

  const generateCSV = () => {
    const csvData = logs.map((log, i) => {
      const calorieIntake = Object.values(log.foodIntake || {}).reduce((acc, curr) => acc + (curr?.calories || 0), 0);
      return {
        Day: `Day ${i + 1}`,
        Steps: log.steps,
        Water: log.waterIntake,
        Calories: calorieIntake,
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "progress_report.csv";
    link.click();
  };

  if (loading) return <div className="text-xl text-center pt-8">📊 Loading your progress...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Progress 📊</h2>

      <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
        <p className="text-lg font-medium text-green-600">{message}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={getChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Steps" stroke="#8884d8" />
          <Line type="monotone" dataKey="Water" stroke="#00bcd4" />
          <Line type="monotone" dataKey="Calories" stroke="#ff7300" />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-6 flex justify-center gap-4">
        <button 
          onClick={generatePDF} 
          className="download-btn"
        >
          Download Report
        </button>
        {/* 🔹 Logout button */}
        <button 
          onClick={handleLogout} 
          className="logout-btn"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Progress;
