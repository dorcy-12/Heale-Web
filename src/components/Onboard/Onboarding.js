/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth"; // Import Firebase authentication and updateProfile
import { setDoc, doc } from "firebase/firestore"; // Import Firestore to store additional user info
import { db } from "../../services/firebaseConfig"; // Import your Firebase config file where db is initialized
import "./Onboarding.css";
import logos from "../../img/mascot1.png";
import EmailStep from "./steps/email/email";
import PasswordStep from "./steps/password/password";
import DateOfBirthStep from "./steps/dob/dob";

const StepIndicators = React.memo(({ currentStep }) => {
  return (
    <div className="step-indicators">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className={`step ${index === currentStep ? "active" : ""}`}
        ></div>
      ))}
    </div>
  );
});

const Onboarding = () => {
  const navigate = useNavigate(); // Hook for navigation
  const auth = getAuth(); // Initialize Firebase Auth
  const [text, setText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [assistantName, setAssistantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showLogo, setShowLogo] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const baseTexts = ["#Welcome!", "#What should I call you?"];
  const additionalTexts = [
    "#What is your email?",
    "#Set your password",
    "#Confirm your age",
  ];

  useEffect(() => {
    const logoTimeout = setTimeout(() => setShowLogo(true), 1000);
    return () => clearTimeout(logoTimeout);
  }, []);

  useEffect(() => {
    if (!showLogo) return;

    const texts =
      currentStep === 0 ? baseTexts : [additionalTexts[currentStep - 1]];
    let currentTextIndex = 0;
    let charIndex = 0;

    const typewriterEffect = () => {
      if (charIndex < texts[currentTextIndex]?.length) {
        setText(
          (prevText) => prevText + texts[currentTextIndex].charAt(charIndex)
        );
        charIndex += 1;
        setTimeout(typewriterEffect, 100); // Adjusted typing speed for optimal duration
      } else {
        if (currentStep === 0 && currentTextIndex < texts.length - 1) {
          setTimeout(() => {
            setText("");
            charIndex = 0;
            currentTextIndex += 1;
            typewriterEffect();
          }, 1000); // Adjusted time for pause between texts for optimal duration
        } else {
          setShowInput(true);
        }
      }
    };

    typewriterEffect();
  }, [showLogo, currentStep]);

  const handleInputChange = (e) => {
    setAssistantName(e.target.value);
  };

  const handleSubmit = () => {
    setCurrentStep(1);
    setText("");
    setShowInput(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address."); // Set error message
      return;
    }

    fetchSignInMethodsForEmail(getAuth(), email)
      .then((signInMethods) => {
        if (signInMethods.length > 0) {
          setEmailError(
            "This email is already in use. Please use a different email."
          ); // Set error message
        } else {
          setCurrentStep(2);
          setText("");
          setShowInput(false);
          setEmailError(""); // Clear error message
        }
      })
      .catch((error) => {
        console.error("Error checking email:", error.message);
        setEmailError("An unexpected error occurred. Please try again."); // Set error message
      });
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if the password is at least 6 characters long
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return; // Stop the submission if the password is too short
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log("User created:", userCredential.user);
        // Update the user profile with the assistantName as displayName and store additional info in Firestore
        updateProfile(userCredential.user, {
          displayName: assistantName,
        })
          .then(() => {
            console.log("Profile updated successfully");
            // Store additional user info in Firestore
            const userRef = doc(db, "users", userCredential.user.uid);
            setDoc(userRef, {
              nickname: assistantName,
              dateOfBirth: dateOfBirth,
              email: email,
            })
              .then(() => {
                console.log("Additional user info stored successfully");
                setCurrentStep(3); // Move to the Date of Birth step
                setText("");
                setShowInput(false);
              })
              .catch((error) => {
                console.error(
                  "Error storing additional user info:",
                  error.message
                );
              });
          })
          .catch((error) => {
            console.error("Error updating profile:", error.message);
          });
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
        setPasswordError("An error occurred while signing up. Please try again."); // Set password error message
      });
  };

  const handleDOBChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  const handleDOBSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate("/chat"); // Redirects user to the chat screen after the last step
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          showInput && (
            <div className="input-container">
              <input
                type="text"
                placeholder="Nickname"
                onChange={handleInputChange}
                value={assistantName}
                aria-label="Enter AI assistant's name"
                className="input-animation"
              />
              <button
                className={`send-button ${
                  assistantName.trim() ? "visible" : ""
                }`}
                onClick={handleSubmit}
                aria-label="Set AI assistant's name"
              >
                ➤
              </button>
            </div>
          )
        );
      case 1:
        return (
          showInput && (
            <EmailStep
              onEmailChange={handleEmailChange}
              onEmailSubmit={handleEmailSubmit}
              email={email}
              errorMessage={emailError} // Pass the error message to the EmailStep component
            />
          )
        );
      case 2:
        return (
          showInput && (
            <PasswordStep
              onPasswordChange={handlePasswordChange}
              onPasswordSubmit={handlePasswordSubmit}
              password={password}
              errorMessage={passwordError} // Pass the password error message to the component
            />
          )
        );
      case 3:
        return (
          showInput && (
            <DateOfBirthStep
              onDOBChange={handleDOBChange}
              onDOBSubmit={handleDOBSubmit}
              dateOfBirth={dateOfBirth}
            />
          )
        );
      default:
        return <div>Welcome to the app, {assistantName}!</div>;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="card">
        <div className="content">
          {showLogo && <img src={logos} alt="Logo" className="logos" />}
          <h1 className="typewriter-text">{text}</h1>
          <form onSubmit={handleEmailSubmit}>
            {renderStep()}
          </form>
        </div>
        <StepIndicators currentStep={currentStep} />
      </div>
    </div>
  );
};

export default Onboarding;*/