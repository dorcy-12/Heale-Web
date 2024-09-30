import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthScreen from "../components/AuthScreen/AuthScreen";
import Chat from "../components/ChatRoom/Chat";
import ForgotPassword from "../components/AuthScreen/ForgotPassword/ForgotPassword";
import { useAuth } from "../context/AuthContext";
const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={isLoggedIn ? <Navigate to="/chat" /> : <AuthScreen />}
        />
        <Route
          path="/chat"
          element={isLoggedIn ? <Chat /> : <Navigate to="/auth" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/chat" : "/auth"} />}
        />
      </Routes>
    </Router>
  );
};

export default AppNavigator;
