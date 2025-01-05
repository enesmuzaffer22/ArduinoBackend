importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Fetch Firebase config from firebase-config.json
fetch("/firebase-config.json")
  .then((response) => response.json())
  .then((config) => {
    firebase.initializeApp(config);
  })
  .catch((error) => {
    console.error("Error fetching Firebase config:", error);
  });

const messaging = firebase.messaging();

// Firebase config dosyasını dinamik olarak yükle
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
