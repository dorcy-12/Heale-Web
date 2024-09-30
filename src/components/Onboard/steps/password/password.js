import React from "react";
import "./password.css"; // Assuming you will create a similar CSS file for PasswordStep

const PasswordStep = ({
  onPasswordChange,
  onPasswordSubmit,
  password,
  errorMessage,
  isPasswordError, // Added prop to indicate if there is a password error
}) => {
  return (
    <div className={`password-input-container ${isPasswordError ? 'error' : ''}`}>
      <input
        type="password"
        placeholder="Password"
        onChange={onPasswordChange}
        value={password || ""}
        className="password-input"
        aria-label="password"
      />
      {errorMessage && <div className="password-error-message">{errorMessage}</div>}
      <button
        onClick={onPasswordSubmit}
        className="password-send-button"
        aria-label="Submit password"
      >
        Submit
      </button>
    </div>
  );
};

export default PasswordStep;
