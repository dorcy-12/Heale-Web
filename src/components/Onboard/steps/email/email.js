import React from "react";
import "./email.css"; // Make sure your CSS file includes the new styles

const EmailStep = ({ onEmailChange, onEmailSubmit, email, errorMessage }) => {
  // Assume email is a string before calling trim and check if it's a valid email format
  return (
    <div className="email-input-container">
      <div className="email-input-wrapper">
        <input
          type="email"
          placeholder="Email Address"
          onChange={onEmailChange}
          value={email || ""} // Ensure that the value is not undefined
          className={`email-input ${errorMessage ? "input-error" : ""}`}
          aria-label="Email"
        />
        {errorMessage && (
          <div className="email-error-message">{errorMessage}</div>
        )}
      </div>
      {errorMessage && (
        <div className="email-error-message">{errorMessage}</div>
      )}
      <button
        onClick={onEmailSubmit}
        className="email-send-button"
        aria-label="Submit email"
      >
        Submit
      </button>
    </div>
  );
};

export default EmailStep;
