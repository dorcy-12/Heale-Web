import React from "react";
import ChatBox from "./Chatbox/Chatbox";
import { connect } from "react-redux";
import { toggleTheme } from "../../store/theme/themeSlice"; // Corrected import path

class Chat extends React.Component {
  state = {
    isSidebarVisible: window.innerWidth > 768,
  };

  handleToggleTheme = () => {
    this.props.toggleTheme(); // Use the toggleTheme function passed via props
  };

  render() {
    const { theme } = this.props; // Access theme from props

    return (
      <div className={`app ${theme}`}>
        <ChatBox theme={theme} setTheme={this.handleToggleTheme} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme.theme, // Map the Redux state to component props
});

const mapDispatchToProps = {
  toggleTheme, // Map the toggleTheme action to props
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
