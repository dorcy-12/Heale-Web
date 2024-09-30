import React from "react";
import Slideshow from "./SlideShow/Slideshow";
import LoginCard from "./Logincard/Logincard";
import Textshow from "./TextShow/Textshow";

class AuthScreen extends React.Component {
  render() {
    return (
      <div className="App">
        <Slideshow />
        <Textshow />
        <LoginCard />
      </div>
    );
  }
}

export default AuthScreen;
