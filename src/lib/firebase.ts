import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const convertToRoman = (month: number): string => {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"
  ];
  return romanNumerals[month];
};

export const getNextLetterNumber = async (templateType: string): Promise<string> => {
  try {
    const counterRef = doc(db, "counters", templateType);
    const counterDoc = await getDoc(counterRef);
    
    let count = 1;
    
    if (counterDoc.exists()) {
      count = counterDoc.data().count + 1;
      await updateDoc(counterRef, { count });
    } else {
      await setDoc(counterRef, { count });
    }
    
    const formattedCount = count.toString().padStart(3, '0');
    
    const currentMonth = new Date().getMonth() + 1;
    const romanMonth = convertToRoman(currentMonth);
    
    return `${formattedCount} / ${romanMonth} / ${new Date().getFullYear()}`;
  } catch (error) {
    console.error("Error getting next letter number:", error);
    return `000 / ... / ${new Date().getFullYear()}`;
  }
};
