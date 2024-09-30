import React, { useState, useEffect, useCallback } from "react";
import "../Feedbacks/Feedback.css";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faMeh,
  faFrownOpen,
} from "@fortawesome/free-regular-svg-icons";
import FeedbackSubmittedModal from "./FeedbackSubmittedModal"; // Ensure this import is correct
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../services/firebaseConfig";
const FeedbackModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Use useCallback to ensure handleOnClose is stable and only changes when onClose changes
  const handleOnClose = useCallback(() => {
    setIsSubmitted(false);
    onClose();
    if (window.location.hash !== "") {
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }, [onClose]);

  // Ensure handleOnClose is included in the dependency array to address the ESLint warning
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        handleOnClose(); // Close the modal after showing the thank you message
      }, 495); // Adjust duration as necessary

      return () => clearTimeout(timer);
    }
  }, [isSubmitted, handleOnClose]);

  const validateFeedback = () => {
    const newErrors = [];
    if (!rating) {
      newErrors.push("Please select a feedback rating.");
    }
    if (feedback.length < 10) {
      newErrors.push("Feedback must be at least 10 characters long.");
    }
    return newErrors;
  };

  const handleSubmitFeedback = async () => {
    const validationErrors = validateFeedback();
    setErrors(validationErrors); // Set errors based on validation

    if (validationErrors.length > 0) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 820); // Timeout for shake animation duration
      return; // Stop submission if there are errors
    }

    try {
      // Assuming sendFeedback is a function that handles the API request
      await sendFeedback({
        rating,
        feedback,
        email: currentUser.email,
      });
      setFeedback("");
      setRating(null);
      setIsSubmitted(true); // Indicate successful submission
    } catch (error) {
      setErrors(["An error occurred while sending your feedback."]);
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 820);
    }
  };

  if (!isOpen) return null;

  return isSubmitted ? (
    <FeedbackSubmittedModal isOpen={true} onClose={handleOnClose} />
  ) : (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <h2>How was your experience?</h2>
        {errors.map((error, index) => (
          <div key={index} className="feedback-error">
            {error}
          </div>
        ))}
        <div className="rating-section">
          <div className="rating-buttons">
            <button
              className={`rating-button ${
                rating === "great" ? "selected" : ""
              }`}
              onClick={() => setRating("great")}
            >
              <FontAwesomeIcon icon={faSmile} size="2x" />
              <span>Great</span>
            </button>
            <button
              className={`rating-button ${rating === "okay" ? "selected" : ""}`}
              onClick={() => setRating("okay")}
            >
              <FontAwesomeIcon icon={faMeh} size="2x" />
              <span>Okay</span>
            </button>
            <button
              className={`rating-button ${rating === "bad" ? "selected" : ""}`}
              onClick={() => setRating("bad")}
            >
              <FontAwesomeIcon icon={faFrownOpen} size="2x" />
              <span>Bad</span>
            </button>
          </div>
        </div>
        <textarea
          className={`feedback-input ${shouldShake ? "error-shake" : ""}`}
          placeholder="Tell us more about your experience..."
          rows="4"
          value={feedback}
          onChange={(e) => {
            setFeedback(e.target.value);
            if (errors.length > 0) setErrors([]);
          }}
        ></textarea>
        <div className="feedback-modal-actions">
          <button onClick={handleSubmitFeedback} className="submit-feedback">
            Submit
          </button>
          <button onClick={handleOnClose} className="close-modal">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

async function sendFeedback(feedbackData) {
  try {
    const docRef = await addDoc(collection(db, "feedbacks"), {
      ...feedbackData,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Error sending feedback");
  }
}
