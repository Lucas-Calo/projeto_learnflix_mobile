import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6Vm6wc7LHNTuyev478uJ8_pFC3QZ1Ar8",
  authDomain: "learnflix-mobile.firebaseapp.com",
  projectId: "learnflix-mobile",
  storageBucket: "learnflix-mobile.firebasestorage.app",
  messagingSenderId: "400178535728",
  appId: "1:400178535728:web:0cb19dd1c92a5403a9fcf5"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };