importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Firebase config dosyasını dinamik olarak yükle
self.addEventListener("install", () => {
  fetch("/firebase-config.json")
    .then((response) => response.json())
    .then((firebaseConfig) => {
      firebase.initializeApp(firebaseConfig);

      const messaging = firebase.messaging();

      messaging.onBackgroundMessage((payload) => {
        console.log(
          "[firebase-messaging-sw.js] Received background message ",
          payload
        );

        const notificationTitle = "Background Message Title";
        const notificationOptions = {
          body: "Background Message body.",
          icon: "/firebase-logo.png",
        };

        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      });
    })
    .catch((error) => {
      console.error("Failed to load Firebase config", error);
    });
});
