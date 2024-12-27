import HomePage from "./pages/HomePage";
import React, { useEffect } from "react";
import { generateToken, messaging } from "./notifications/firebase";
import { onMessage } from "firebase/messaging";

function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {
      console.log("Message recieved. ", payload);
    });
  }, []);

  return (
    <div>
      <HomePage />
    </div>
  );
}

export default App;
