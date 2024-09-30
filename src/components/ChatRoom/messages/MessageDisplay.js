import React from 'react';
import './MessageDisplay.css';

class MessageDisplay extends React.Component {
    render() {
        return (
            <div className="message-display">
                {this.props.messages.map((message, index) => (
                    <div key={index} className="message">
                        {message}
                    </div>
                ))}
            </div>
        );
    }
}

export default MessageDisplay;