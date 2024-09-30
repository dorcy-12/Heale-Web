import React, { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import "../Logincard/Logincard.css";
import logo from "../../../img/logo.png";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../services/firebaseConfig";
import Lottie from "react-lottie-player";
import google from "../../../img/googe-icon.png";

// Initialize Firebase App outside of component
initializeApp(firebaseConfig);

const LoginCard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);
  const emailInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const passwordInputRef = useRef(null);
  const [isIframe, setIsIframe] = useState(false);
  const confirmPasswordInputRef = useRef(null);
  const auth = getAuth();
  const loadingAnimation = require("../../../img/loading-animation.json");

  const handleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      setInfo("");
      setError("");
      setLoading(true);
      if (!email || !password) {
        setError("Email and Password are required.");
        emailInputRef.current.style.borderColor = !email ? "red" : "";
        passwordInputRef.current.style.borderColor = !password ? "red" : "";
        setLoading(false);
        return;
      }
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (!user.emailVerified) {
          setError(
            "Email is not verified. Please verify your email to log in."
          );
          await signOut(auth);
          setUser(user);
          setShowResendLink(true);
          setLoading(false);
          return;
        }
        setLoading(false);
      } catch (error) {
        handleAuthError(error);
        setLoading(false);
      }
    },
    [email, password, auth]
  );
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.includes("Instagram")) {
      setIsIframe(true);
    }
  }, []);

  const handleGoogleSignIn = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        setLoading(false);
        navigate("/chat");
      } catch (error) {
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    },
    [auth, navigate]
  );
  const handleCreateAccount = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setInfo("");
      setLoading(true);
      if (!email || !password || !confirmPassword) {
        setError("All fields are required.");
        emailInputRef.current.style.borderColor = !email ? "red" : "";
        passwordInputRef.current.style.borderColor = !password ? "red" : "";
        confirmPasswordInputRef.current.style.borderColor = !confirmPassword
          ? "red"
          : "";
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        passwordInputRef.current.style.borderColor = "red";
        confirmPasswordInputRef.current.style.borderColor = "red";
        setLoading(false);
        return;
      }
      if (!termsAccepted) {
        setError("You must accept the terms and conditions.");
        setLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        await sendEmailVerification(user);
        await signOut(auth);
        setLoading(false);
        setError("");
        setInfo(
          "We have sent a verification link to the email address you provided."
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTermsAccepted(false);
      } catch (error) {
        handleAuthError(error);
        setLoading(false);
      }
    },
    [email, password, confirmPassword, termsAccepted, auth]
  );
  const handleSignUpClick = () => {
    setIsSignUp(true);
    setError(""); // Clear any existing error messages
    setInfo("");
    setEmail(""); // Clear email input
    setPassword(""); // Clear password input
    setTermsAccepted(false);
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError("");
    try {
      await sendEmailVerification(user);
      setInfo("Verification email has been resent. Please check your inbox.");
    } catch (error) {
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        setError("Please enter a valid email address.");
        break;
      case "auth/user-disabled":
        setError("Your account has been disabled. Please contact support.");
        break;
      case "auth/user-not-found":
      case "auth/wrong-password":
        setError("Incorrect email or password. Please try again.");
        break;
      case "auth/too-many-requests":
        setError("Too many login attempts. Please try again later.");
        break;
      case "permission-denied":
        setError("You do not have permission to access this resource.");
        break;
      default:
        setError("An unexpected error occurred. Please try again later.");
        break;
    }
    emailInputRef.current.style.borderColor = "red";
    passwordInputRef.current.style.borderColor = "red";
  };

  const handleBackToSignIn = () => {
    setIsSignUp(false);
    setError(""); // Clear any existing error messages
    setEmail(""); // Clear email input
    setPassword(""); // Clear password input
    setConfirmPassword(""); // Clear confirm password input
    setShowResendLink(false);
    setInfo("");
  };

  useEffect(() => {
    const handleEnterPress = (event) => {
      if (event.key === "Enter") {
        handleSignIn(event);
      }
    };
    document.addEventListener("keydown", handleEnterPress);
    return () => document.removeEventListener("keydown", handleEnterPress);
  }, [handleSignIn, handleCreateAccount, isSignUp]);

  return (
    <div className="login-card">
      {isSignUp && (
        <button className="back-button" onClick={handleBackToSignIn}>
          &larr; Back
        </button>
      )}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-login" />
      </div>
      <h1>Welcome to Heale</h1>

      {!isSignUp ? (
        <>
          <input
            ref={emailInputRef}
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            ref={passwordInputRef}
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="error-message">{error}</div>}
          {info && <div className="success-message">{info}</div>}
          {showResendLink && (
            <div className="resend-verification">
              Didn't receive the email?{" "}
              <button
                className="resend-button"
                onClick={handleResendVerification}
              >
                Resend
              </button>
            </div>
          )}
          <div className="link forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          {loading ? (
            <Lottie
              loop
              animationData={loadingAnimation}
              play
              style={{ width: "10vw", height: "10vh" }}
            />
          ) : (
            <button className="auth-btn signin-btn" onClick={handleSignIn}>
              Sign in
            </button>
          )}

          <div className="link gray-text">or</div>
          <button className="auth-btn signup-btn" onClick={handleSignUpClick}>
            Sign up
          </button>
          {!isIframe && ( // Conditionally render Google button based on isIframe
            <button
              className="auth-btn google-btn"
              onClick={handleGoogleSignIn}
            >
              <img src={google} alt="Continue with Google" />
              Continue with Google
            </button>
          )}
        </>
      ) : (
        <>
          <input
            ref={emailInputRef}
            className="input fade-in"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            ref={passwordInputRef}
            className="input fade-in"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            ref={confirmPasswordInputRef}
            className="input fade-in"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="terms-container">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => setTermsAccepted(!termsAccepted)}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <a
                href="https://www.healeai.com/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                terms and conditions
              </a>
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          {info && <div className="success-message">{info}</div>}
          {loading ? (
            <Lottie
              loop
              animationData={loadingAnimation}
              play
              style={{ width: "10vw", height: "10vh" }}
            />
          ) : (
            <button
              className="auth-btn signin-btn"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
          )}
        </>
      )}
      <div className="terms-section">
        <span>
          <a href="https://www.healeai.com/terms-and-conditions">
            Terms of Use
          </a>
        </span>
        <span className="divider">|</span>
        <span>
          <a href="https://www.healeai.com/terms-and-conditions">
            Privacy Policy
          </a>
        </span>
      </div>
    </div>
  );
};

export default LoginCard;
