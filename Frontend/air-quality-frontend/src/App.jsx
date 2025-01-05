import HomePage from "./pages/HomePage";
import React, { useEffect } from "react";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
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
