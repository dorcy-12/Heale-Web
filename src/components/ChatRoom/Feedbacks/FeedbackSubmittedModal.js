import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

const FeedbackSubmittedModal = ({ isOpen, onClose }) => {
  return (
    <div className={`feedback-submitted-modal ${isOpen ? 'open' : ''}`}>
      <div className="feedback-submitted-content">
        <div className="tick-animation">
          <CheckCircleOutlined style={{ fontSize: '48px', color: 'green' }} />
        </div>
        <p>Thank you for your feedback!</p>
      </div>
    </div>
  );
};

export default FeedbackSubmittedModal;