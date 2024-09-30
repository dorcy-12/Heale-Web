import React from 'react';
import Logo from '../../../img/logo1.png';
import FeedbackIconLight from '../../../img/review-light.png';
import FeedbackIconDark from '../../../img/review-dark.png';
import LogoutIconLight from '../../../img/logout-light.png';
import LogoutIconDark from '../../../img/logout-dark.png';
import './Sidebar.css';
import FeedbackModal from '../Feedbacks/Feedbacks';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ className,theme, toggleTheme }) => {
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
    const sidebarRef = React.useRef();
    const navigate = useNavigate();
    const auth = getAuth();

    React.useEffect(() => {
        const sidebarElement = sidebarRef.current;
        const prevThemeClass = theme === 'light' ? '' : 'dark-mode';
        const currentThemeClass = theme === 'dark' ? 'dark-mode' : '';

        if (prevThemeClass) {
            sidebarElement.classList.remove(prevThemeClass);
        }

        if (currentThemeClass) {
            sidebarElement.classList.add(currentThemeClass);
        }
    }, [theme]);

    const toggleFeedbackModal = () => {
        setIsFeedbackModalOpen(prevState => !prevState);
    };

    const handleSubmitFeedback = () => {
        alert('Feedback submitted!');
        toggleFeedbackModal();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/auth'); // Redirect to the login page after successful logout
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const renderThemeToggle = () => {
        const isDarkMode = theme === 'dark';

        return (
            <div className="theme-toggle">
                <span className="toggle-label">{isDarkMode ? 'Dark' : 'Light'}</span>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
        );
    };

    const isDarkMode = theme === 'dark';

    return (
        <aside className={isDarkMode ? 'sidebar dark-mode' : 'sidebar'} ref={sidebarRef}>
            <div className="the-card">
                <div className="logo-container">
                    <img src={Logo} alt="Logo" className="logo" />
                </div>
                <nav className="navigation">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="#feedback" className="nav-link" onClick={toggleFeedbackModal}>
                                <img src={isDarkMode ? FeedbackIconLight : FeedbackIconDark} alt="Feedback" className="feedbackicon" />
                                Feedback
                            </a>
                        </li>
                        <li className="nav-item">
                            {renderThemeToggle()}
                        </li>
                        <li className="nav-item">
                            <a href="#logout" className="nav-link" onClick={handleLogout}>
                                <img src={isDarkMode ? LogoutIconLight : LogoutIconDark} alt="Logout" className="logouticon" />
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={toggleFeedbackModal}
                onSubmitFeedback={handleSubmitFeedback}
            />
        </aside>
    );
};

export default Sidebar;