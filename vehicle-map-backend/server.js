const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const PORT = 5000;

app.use(cors());

let vehicleData = [];
try {
  vehicleData = JSON.parse(fs.readFileSync("./vehicle-path.json"));
} catch (err) {
  console.error("Error reading vehicle-path.json:", err.message);
  vehicleData = [];
}

let currentIndex = 0;

app.get("/location", (req, res) => {
  if (vehicleData.length === 0) {
    return res.status(500).json({ error: "No vehicle data available" });
  }
  if (currentIndex >= vehicleData.length) {
    currentIndex = vehicleData.length - 1;
  }
  res.json(vehicleData.slice(0, currentIndex + 1));
  currentIndex++;
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
