import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAL5VZOvEO2cq_skauKQfa6cU0H-jP-Oss",
  authDomain: "leilaoapp-1dc5a.firebaseapp.com",
  projectId: "leilaoapp-1dc5a",
  storageBucket: "leilaoapp-1dc5a.appspot.com",
  messagingSenderId: "450204851209",
  appId: "1:450204851209:web:471c55481b6e08e8846cd8",
  measurementId: "G-VWSJ89RSYL"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
