require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const app = express();
const port = 3000; // Server port
const cors = require("cors");
const { getMessaging } = require("firebase-admin/messaging");

app.use(cors());

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// File to store air quality data
const dataFilePath = path.join(__dirname, "airQualityData.json");
const tokensFilePath = path.join(__dirname, "tokens.json");

// Initialize data files if they don't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}
if (!fs.existsSync(tokensFilePath)) {
  fs.writeFileSync(tokensFilePath, JSON.stringify([]));
}

// Middleware: To handle JSON data
app.use(express.json());

// Threshold value for air quality
const THRESHOLD = 370;

// Endpoint to save device token
app.post("/save-token", (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  // Read existing tokens
  const tokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf-8"));

  // Check if token already exists
  if (!tokens.includes(token)) {
    tokens.push(token);
    fs.writeFileSync(tokensFilePath, JSON.stringify(tokens, null, 2));
    console.log("Device token saved:", token);
  } else {
    console.log("Token already exists:", token);
  }

  res.sendStatus(200);
});

// Endpoint to receive air quality data from ESP8266
app.post("/api/air-quality", (req, res) => {
  const { value } = req.body;
  if (typeof value !== "number") {
    return res
      .status(400)
      .json({ error: 'Invalid data format. "value" must be a number.' });
  }

  const timestamp = new Date().toISOString();
  const newEntry = { value, timestamp };

  // Read existing data, append new entry, and save back to the file
  const existingData = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  existingData.push(newEntry);
  fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

  // Check if value exceeds the threshold
  if (value > THRESHOLD) {
    sendNotification(value, timestamp);
  }

  res
    .status(201)
    .json({ message: "Data saved successfully!", entry: newEntry });
});

// Function to send a Firebase notification
function sendNotification(value, timestamp) {
  console.log("Reading tokens from file...");

  const tokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf-8"));
  console.log("Tokens read:", tokens);

  const deviceToken = tokens[tokens.length - 1];
  console.log("Preparing message for token:", deviceToken);

  const message = {
    notification: {
      title: "Hava Kalite Asistanı",
      body: "Cihazın bulunduğu ortamın hava kalitesinde bir anormallik tespit edildi!",
    },
    token: deviceToken,
  };

  console.log(message);

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Notification sent successfully:", response);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
}

// Endpoint to fetch air quality data for frontend
app.get("/api/air-quality", (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
  res.json(data);
});

// Middleware for 404 error
app.use((req, res) => {
  res.status(404).send("Page not found!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
