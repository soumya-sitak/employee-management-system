require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const employeeRoutes = require("./routes/employees");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Employee Management Backend is Running!");
});

// Database Test Route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Connected to PostgreSQL",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Database Connection Failed",
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
