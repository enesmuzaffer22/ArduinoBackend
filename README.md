# Air Quality Monitoring and Notification System

This project demonstrates a system that collects air quality data using the ESP8266 module and the MQ135 air quality sensor, processes the data via a backend (Express.js), and sends notifications to users when certain thresholds are exceeded. The data is stored in JSON format on the backend and visualized graphically on the frontend (React.js and Chart.js).

## Project Components

- **ESP8266 Module:** A microcontroller that collects data from the air quality sensor and sends it to the backend via a POST request.
- **MQ135 Air Quality Sensor:** A sensor that measures air quality and provides readings for various pollutants.
- **Backend (Express.js):** The backend receives and processes the data in JSON format, and when air quality exceeds a specified threshold, it sends notifications via Firebase.
- **Firebase:** Sends real-time notifications to users when the air quality is poor.
- **Frontend (React.js and Chart.js):** The user interface displays graphs and retrieves data from the backend via a GET request. Chart.js is used to visualize the data.

## Features

- **Data Collection and Transmission:** The ESP8266 module collects data from the MQ135 sensor and sends it to the backend via a POST request.
- **Data Processing:** The backend stores the received data in JSON format and sends notifications to users via Firebase when the air quality is poor.
- **Graph Visualization:** The frontend visualizes the data in graphs. Chart.js is used to display air quality trends over time.
- **Notification System:** When the air quality exceeds a set threshold, Firebase Cloud Messaging (FCM) sends a notification to the user.

## Technologies Used

- **ESP8266 (NodeMCU)**
- **MQ135 Air Quality Sensor**
- **Express.js** (Backend)
- **React.js** (Frontend)
- **Chart.js** (Graph Visualization)
- **Firebase Cloud Messaging (FCM)** (Notifications)
- **JSON** (Data Format)

## Installation and Setup

1. **Backend (Express.js) Setup:**
   - Navigate to the backend directory.
   - Run `npm install` to install the required packages.
   - Start the server with `npm run start`.

2. **Frontend (React.js) Setup:**
   - Navigate to the frontend directory.
   - Run `npm install` to install the required packages.
   - Start the React app with `npm run dev`.

3. **Firebase Configuration:**
   - Create a Firebase project and configure FCM.
   - Integrate Firebase settings into the backend.

## Contributing

Feel free to fork the repository, submit issues, or create pull requests with suggestions or improvements.

## License

This project is licensed under the MIT License.

## Contributors

- [Muzaffer Enes YILDIRIM](https://github.com/MuzafferEnes)
- [Mert TOSUN](https://github.com/mertt1010)
- [Gökhan ALTUNDAL](https://github.com/GokhanALTUNDAL)
