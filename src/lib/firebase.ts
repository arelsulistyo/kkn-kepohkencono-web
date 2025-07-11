import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to convert month number to Roman numeral
export const convertToRoman = (month: number): string => {
  const romanNumerals = [
    "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"
  ];
  return romanNumerals[month];
};

// Function to get the next letter number for a specific template
export const getNextLetterNumber = async (templateType: string): Promise<string> => {
  try {
    // Reference to the counter document
    const counterRef = doc(db, "counters", templateType);
    const counterDoc = await getDoc(counterRef);
    
    let count = 1; // Default to 1 if no document exists
    
    if (counterDoc.exists()) {
      // Get the current count and increment it
      count = counterDoc.data().count + 1;
      // Update the document with the new count
      await updateDoc(counterRef, { count });
    } else {
      // Create a new document if it doesn't exist
      await setDoc(counterRef, { count });
    }
    
    // Format the count with leading zeros (e.g., 001, 002, etc.)
    const formattedCount = count.toString().padStart(3, '0');
    
    // Get current month in Roman numerals
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
    const romanMonth = convertToRoman(currentMonth);
    
    // Return the formatted letter number
    return `${formattedCount} / ${romanMonth} / ${new Date().getFullYear()}`;
  } catch (error) {
    console.error("Error getting next letter number:", error);
    // Return a fallback format in case of error
    return `000 / ... / ${new Date().getFullYear()}`;
  }
};
