// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDr5x56KQQOqUA5_BTYGuJOLOK_YTCV0as",
    authDomain: "ev-charging-station-app-408604.firebaseapp.com",
    projectId: "ev-charging-station-app-408604",
    storageBucket: "ev-charging-station-app-408604.appspot.com",
    messagingSenderId: "629585477772",
    appId: "1:629585477772:web:8b8927cf17b98db836bba9",
    measurementId: "G-37YH41PRB1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
