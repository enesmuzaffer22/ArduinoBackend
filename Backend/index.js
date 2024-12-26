require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
const app = express();
const port = 3000; // Server port
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");

app.use(cors());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Air Quality API",
      version: "1.0.0",
      description: "API for managing air quality data",
    },
    servers: [
      { url: "http://localhost:3000" }, // Replace with your server URL
    ],
  },
  apis: [__filename], // This file will contain Swagger annotations
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Firebase Admin SDK initialization
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com",
};

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
const THRESHOLD = 270;

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
  const message = {
    notification: {
      title: "Air Quality Alert!",
      body: `The air quality index is ${value} as of ${timestamp}. It exceeds the safe threshold.`,
    },
  };

  // Read tokens from file
  const tokens = JSON.parse(fs.readFileSync(tokensFilePath, "utf-8"));

  if (tokens.length > 0) {
    tokens.forEach((token) => {
      admin
        .messaging()
        .send({
          token: token,
          notification: message.notification,
        })
        .then((response) => {
          console.log(
            "Notification sent successfully to token:",
            token,
            response
          );
        })
        .catch((error) => {
          console.error("Error sending notification to token:", token, error);
        });
    });
  } else {
    console.log("No tokens available to send notification.");
  }
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
