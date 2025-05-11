// Import the Firebase SDK
import firebase from "firebase/app"
import "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
}

// Initialize Firebase
try {
  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db = firebase.firestore()
  console.log("Firebase initialized successfully")
} catch (error) {
  console.error("Firebase initialization error:", error)
}
