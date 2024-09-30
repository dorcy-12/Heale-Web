import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../services/firebaseConfig.js"; // Ensure this path is correct for your firebase config file
import "../ForgotPassword/ForgotPassword.css";
import { Link } from "react-router-dom"; // Import Link for navigation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true); // State to track if email is valid
  const [emailSent, setEmailSent] = useState(false); // State to track if email has been sent
  const emailInputRef = useRef(null); // useRef hook to reference the email input

  useEffect(() => {
    // Initialize Firebase with the named import
    initializeApp(firebaseConfig);
  }, []);

  const validateEmail = async (email) => {
    const auth = getAuth();
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    const isValid = signInMethods.length > 0; // Returns true if email is registered
    setEmailValid(isValid); // Update emailValid state based on validation
    if (!isValid) {
      emailInputRef.current.focus(); // Focus on the input if email is not valid
      emailInputRef.current.style.borderColor = "red"; // Make the input box border red if email is not valid
      emailInputRef.current.classList.add("shake-animation"); // Add shake animation class
      setTimeout(() => {
        emailInputRef.current.classList.remove("shake-animation");
        emailInputRef.current.style.borderColor = ""; // Reset border color after shake animation
      }, 500); // Remove shake animation class and reset border color after 500ms
    } else {
      emailInputRef.current.style.borderColor = ""; // Reset border color if email is valid
    }
    return isValid;
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    const emailIsValid = await validateEmail(email);

    if (!emailIsValid) {
      return;
    }

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      console.error(error.message); // Log error to console instead of showing an error message
    }
  };

  const handleResendEmail = async () => {
    const emailIsValid = await validateEmail(email);

    if (!emailIsValid) {
      return;
    }

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
    } catch (error) {
      console.error(error.message); // Log error to console instead of showing an error message
    }
  };

  return (
    <div className="forgot-password-page">
      <h1>Forgot Password</h1>
      {!emailSent ? (
        <>
          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              ref={emailInputRef} // Attach the ref to the input element
              className={`email-input ${
                !emailValid ? "input-error shake-animation" : ""
              }`} // Apply error styling and shake animation if email is not valid
              style={!emailValid ? { borderColor: "red" } : {}} // Inline style to make input box border red if email is not valid
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="submit-button">
              Send Verification Email
            </button>
          </form>

          {!emailValid && (
            <div className="email-error-message">Email is not valid</div>
          )}
        </>
      ) : (
        <div>
          <div className="success-message">
            A password reset email has been sent to your address. Please check
            your email.
          </div>
          <div className="resend-email" style={{ textAlign: "center" }}>
            <button onClick={handleResendEmail} className="resend-email-button">
              Resend Email
            </button>
          </div>
          <div className="back-to-login" style={{ textAlign: "center" }}>
            <Link to="/auth" className="back-to-login-link">
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
