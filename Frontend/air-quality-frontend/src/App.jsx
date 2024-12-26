import HomePage from "./pages/HomePage";
import React, { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";

// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
  measurementId: import.meta.env.VITE_APP_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function App() {
  useEffect(() => {
    // Bildirim izni isteme
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
        }) // Vapid key gerekebilir
          .then((currentToken) => {
            if (currentToken) {
              console.log("FCM Token:", currentToken);
              // Token'i backend'e gönder

              fetch("http://localhost:3000/save-token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: currentToken }),
              });
            } else {
              console.log("No registration token available");
            }
          })
          .catch((error) => {
            console.error("Error getting token", error);
          });

        // Bildirim geldiğinde
        onMessage(messaging, (payload) => {
          console.log("Notification received:", payload);
          alert(payload.notification.body);
        });
      } else {
        console.log("Notification permission denied");
      }
    });
  }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
