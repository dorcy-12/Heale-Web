import React from 'react';
import './dob.css'; // Assuming similar naming for CSS file

const DateOfBirthStep = ({ onDOBChange, onDOBSubmit, dateOfBirth }) => {
  // Check if dateOfBirth is a valid date string
  const isDateValid = dateOfBirth && !isNaN(Date.parse(dateOfBirth));

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (isDateValid) {
      onDOBSubmit();
    }
  };

  return (
    <form className="dob-input-container" onSubmit={handleSubmit}>
      <input
        type="date"
        placeholder="Date of Birth"
        onChange={onDOBChange}
        value={dateOfBirth || ''} // Ensure that the value is not undefined
        className="dob-input"
        aria-label="Enter date of birth"
      />
      {dateOfBirth && (
        <button
          type="submit"
          disabled={!isDateValid} // Disable the button if date is not valid
          className="dob-send-button"
          aria-label="Submit date of birth"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default DateOfBirthStep;
