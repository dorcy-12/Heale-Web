import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DeleteOutlined } from "@ant-design/icons";
import Logo from "../../../img/logo1.png";
import SendLogo from "../../../img/up-arrows.png";
import FeedbackIconLight from "../../../img/review-light.png";
import FeedbackIconDark from "../../../img/review-dark.png";
import LogoutIconLight from "../../../img/logout-light.png";
import LogoutIconDark from "../../../img/logout-dark.png";
import FeedbackModal from "../Feedbacks/Feedbacks";
import FeedbackSubmittedModal from "../Feedbacks/FeedbackSubmittedModal";
import { useNavigate } from "react-router-dom";
import "./Chatbox.css";
import { auth } from "../../../services/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import Lottie from "react-lottie-player";

const ChatBox = ({ theme, setTheme }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showLimitNotice, setShowLimitNotice] = useState(true);
  const [msgCount, setMsgCount] = useState(20);
  const { currentUser } = useAuth();
  const textareaRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageDisplayRef = useRef(null);
  const [isFeedbackSubmittedModalOpen, setIsFeedbackSubmittedModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const loadingAnimation = require("../../../img/loading-animation.json");

  const addMessage = (newMessage, sender = "user", count) => {
    if (count <= 5) {
      setShowLimitNotice(true);
    } else {
      setShowLimitNotice(false);
    }
    setMsgCount(count);
    const messageObj = {
      id: Math.random().toString(),
      content: newMessage,
      role: sender,
      timestamp: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, messageObj]);

    if (sender === "user") {
      handleSendMessage(newMessage);
    }
  };

  const handleSendMessage = async (message) => {
    setIsLoading(true);

    const payload = {
      userId: currentUser.uid,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    };

    try {
      textareaRef.current.focus();
      const response = await axios.post(
        "https://us-central1-heale-9723e.cloudfunctions.net/openAIChat",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      addMessage(response.data.message, "receiver", response.data.count);
      
    } catch (e) {
      if (e.response && e.response.status === 429) {
        setErrorMessage("You have reached your daily limit of 20 messages.");
      } else {
        console.error("Error sending message: ", e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllMessages = () => {
    setMessages([]);
  };

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleTheme = (newTheme) => {
    if (theme !== newTheme) {
      setTheme(newTheme);
    }
  };

  const renderThemeToggle = () => (
    <div className="theme-toggle">
      <button
        className={`theme-btn ${theme === "light" ? "active" : ""}`}
        onClick={() => handleToggleTheme("light")}
      >
        Light
      </button>
      <button
        className={`theme-btn ${theme === "dark" ? "active" : ""}`}
        onClick={() => handleToggleTheme("dark")}
      >
        Dark
      </button>
    </div>
  );

  const toggleFeedbackModal = () => {
    setIsFeedbackModalOpen((prevState) => !prevState);
  };

  const handleSubmitFeedback = () => {
    setIsFeedbackSubmittedModalOpen(true);
    toggleFeedbackModal();
    const timeoutId = setTimeout(() => {
      toggleFeedbackSubmittedModal();
    }, 1000);
    return () => clearTimeout(timeoutId);
  };

  const toggleFeedbackSubmittedModal = () => {
    setIsFeedbackSubmittedModalOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    setLoading(true);
    await auth.signOut();
    setLoading(false);
    navigate("/auth");
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    if (messageDisplayRef.current) {
      messageDisplayRef.current.scrollTop =
        messageDisplayRef.current.scrollHeight;
    }
  }, [messages]);

  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className={`chat-interface ${theme}`}>
      <div
        className={
          loading ? "loading-overlay" : "loading-overlay hidden-animation"
        }
      >
        <Lottie
          loop
          animationData={loadingAnimation}
          play
          style={{ width: "20vw", height: "20vh" }}
        />
      </div>
      <>
        <div className="top-layer">
          <div className="logo-contain">
            <img src={Logo} alt="Logo" className="logos" />
          </div>
          <div className="logout-theme-btn">
            {renderThemeToggle()}
            <a
              href="#logout"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              <img
                src={theme === "dark" ? LogoutIconLight : LogoutIconDark}
                alt="Logout"
                className="logouticon"
              />
            </a>
          </div>
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={toggleFeedbackModal}
            onSubmitFeedback={handleSubmitFeedback}
          />
          <FeedbackSubmittedModal
            isOpen={isFeedbackSubmittedModalOpen}
            onClose={toggleFeedbackSubmittedModal}
          />
        </div>
        <div className="message-container">
          <div className="message-display" ref={messageDisplayRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.role === "user" ? "user-message" : "receiver-message"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && <div className="loading-animation">Typing...</div>}
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </div>
        </div>
        <div
          className={`messages-left ${showLimitNotice ? "" : "opacity-low"}`}
        >
          {msgCount} messages left
        </div>
        <div className="chat-box" ref={chatBoxRef}>
          <DeleteOutlined
            className={`delete-icon`}
            onClick={deleteAllMessages}
          />
          <div
            className={`input-container ${!!errorMessage ? "disabled" : ""}`}
            style={{
              width: "100%", // Set width to 100% to match the chatbox width
            }}
          >
            <textarea
              ref={textareaRef}
              rows="1"
              className="chat-input"
              placeholder="Message Heale..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (e.target.value.trim()) {
                    addMessage(e.target.value.trim());
                    setMessage("");
                  }
                }
              }}
              disabled={!!errorMessage}
            />
            <div
              className="send-icon"
              onClick={() => {
                if (message.trim()) {
                  addMessage(message);
                  setMessage("");
                }
              }}
            >
              <img src={SendLogo} alt="Send Icon" />
            </div>
          </div>

          <a
            href="#feedback"
            className="feedback-logo"
            onClick={toggleFeedbackModal}
          >
            <img
              src={theme === "dark" ? FeedbackIconLight : FeedbackIconDark}
              alt="Feedback"
              className="feedbackicon"
            />
          </a>
        </div>
      </>
    </main>
  );
};

export default ChatBox;
