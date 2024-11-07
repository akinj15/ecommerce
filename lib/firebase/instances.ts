"use client";

import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./config";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(firebaseApp);
auth.useDeviceLanguage();
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export {
  auth,
  db,
  storage
}