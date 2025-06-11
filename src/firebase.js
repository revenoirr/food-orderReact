import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgC9yNs2T2uBAVUCjI2Wix87qvZH4fNLg",
  authDomain: "food-devilery-cd43c.firebaseapp.com",
  projectId: "food-devilery-cd43c",
  storageBucket: "food-devilery-cd43c.firebasestorage.app",
  messagingSenderId: "164494633924",
  appId: "1:164494633924:web:67da9d157732aa0ec51291",
  measurementId: "G-YMN00ET0CE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;