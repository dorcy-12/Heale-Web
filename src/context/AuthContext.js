import {
  browserLocalPersistence,
  setPersistence,
  onAuthStateChanged,
  reload,
} from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../services/firebaseConfig";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);
  useEffect(() => {
    setLocalPersistence(); // Set local persistence on component mount
  }, []);

  const setLocalPersistence = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.error("Error setting local persistence:", error);
    }
  };
  async function initializeUser(user) {
    if (user) {
      await reload(user);
      if (user.emailVerified) {
        setCurrentUser(user);
        setIsLoggedIn(true);
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
    setIsLoading(false);
  }

  const values = {
    currentUser,
    isLoggedIn,
    isLoading,
  };
  return (
    <AuthContext.Provider value={values}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
