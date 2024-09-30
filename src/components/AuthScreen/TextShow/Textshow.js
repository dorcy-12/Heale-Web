import React from 'react';
import './Textshow.css';

class Textshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTextIndex: 0,
      texts: [
        {
          header: "Welcome",
          subheader: "To Your Safe Space",
          description: "Embark on a journey of self-discovery and healing in a space where your feelings are heard and valued."
        },
        {
          header: "We Understand",
          subheader: "Life Can Be Overwhelming",
          description: "Navigate life's challenges with a compassionate partner by your side, guiding you towards emotional well-being."
        },
        {
          header: "Here to Help",
          subheader: "Every Step of the Way",
          description: "Our personalized therapy sessions are designed to empower you, fostering resilience and inner peace."
        },
        {
          header: "Your Trust",
          subheader: "Is Our Priority",
          description: "Experience a confidential and non-judgmental environment where your privacy is respected and protected."
        },
        {
          header: "Holistic Care",
          subheader: "For Your Wellbeing",
          description: "Our approach integrates various therapeutic techniques to address your emotional, mental, and spiritual needs."
        },
        {
          header: "Together",
          subheader: "We Can Make a Difference",
          description: "Join us in creating a brighter, healthier future for yourself. Your journey to healing starts here."
        },
      ],
      isHeaderVisible: false,
      isSubheaderVisible: false,
      isDescriptionVisible: false,
    };
    this.totalAnimationTime = 7000; // Total time for the entire text set to show and hide
    this.textVisibilityTime = 5500; // Time for each text part to show
  }

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    this.animationInterval = setInterval(() => {
      this.setState({ isHeaderVisible: true });

      setTimeout(() => {
        this.setState({ isSubheaderVisible: true });
      }, this.textVisibilityTime / 3);

      setTimeout(() => {
        this.setState({ isDescriptionVisible: true });
      }, this.textVisibilityTime * 2 / 3);

      setTimeout(() => {
        this.setState({ isHeaderVisible: false, isSubheaderVisible: false, isDescriptionVisible: false });
      }, this.textVisibilityTime);

      // Move to the next text only after everything has faded out
      setTimeout(() => {
        this.setState(prevState => ({
          currentTextIndex: (prevState.currentTextIndex + 1) % prevState.texts.length
        }));
      }, this.totalAnimationTime);
    }, this.totalAnimationTime + 1000); // Interval for the whole cycle, with a pause between cycles
  };

  componentWillUnmount() {
    clearInterval(this.animationInterval);
  }

  renderText = (text, isHeaderVisible, isSubheaderVisible, isDescriptionVisible) => (
    <div className="text-container">
      <h1 className={isHeaderVisible ? 'fade-in' : 'fade-out'}>{text.header}</h1>
      <h2 className={isSubheaderVisible ? 'fade-in' : 'fade-out'}>{text.subheader}</h2>
      <p className={isDescriptionVisible ? 'fade-in' : 'fade-out'}>{text.description}</p>
    </div>
  );

  render() {
    const { currentTextIndex, texts, isHeaderVisible, isSubheaderVisible, isDescriptionVisible } = this.state;
    const currentText = texts[currentTextIndex];

    return (
      <div className="Textshow">
        <header className="Text-header">
          {this.renderText(currentText, isHeaderVisible, isSubheaderVisible, isDescriptionVisible)}
        </header>
      </div>
    );
  }
}

export default Textshow;
