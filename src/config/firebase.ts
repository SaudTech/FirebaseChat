// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSSd_RWuiWMAbp_LVuvwgr3aPaOE8qfgQ",
  authDomain: "realtimechat-d34b2.firebaseapp.com",
  projectId: "realtimechat-d34b2",
  storageBucket: "realtimechat-d34b2.appspot.com",
  messagingSenderId: "792883166882",
  appId: "1:792883166882:web:a6433470acee6ef57de1fb",
  measurementId: "G-JQEY1J4SEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;