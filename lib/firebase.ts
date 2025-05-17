import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

// Firebase configuration
// Note: In a production environment, these should be environment variables
const firebaseConfig = {
  apiKey: "AIzaSyCX2HlWW7L1XLLLJC7_HAHp6cbNp-STWcg",
  authDomain: "smart-parking-app-f383e.firebaseapp.com",
  projectId: "smart-parking-app-f383e",
  storageBucket: "smart-parking-app-f383e.firebasestorage.app",
  messagingSenderId: "570256090499",
  appId: "1:570256090499:web:21152e13a452ba3a0d82b6",
  measurementId: "G-D2L4BS6BDJ",
  // Menggunakan URL database dengan region yang benar
  databaseURL: "https://smart-parking-app-f383e-default-rtdb.asia-southeast1.firebasedatabase.app",
}

// Initialize Firebase only if it hasn't been initialized yet
const apps = getApps()
const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig)

// Initialize Firebase services
// Only initialize auth in browser environment
let auth
let database

// Check if we're in a browser environment
if (typeof window !== "undefined") {
  try {
    auth = getAuth(app)
    database = getDatabase(app)
  } catch (error) {
    console.error("Error initializing Firebase services:", error)
  }
} else {
  // Server-side initialization for database only
  try {
    database = getDatabase(app)
  } catch (error) {
    console.error("Error initializing Firebase database on server:", error)
  }
}

export { app, auth, database }