import React from 'react';
import pico from '../../../img/thinking.png';
import '../SlideShow/Slideshow.css';

class Slideshow extends React.Component {
    render() {
        return (
            <div className="slideshow">
                <div className="slide">
                    <img src={pico} alt="Static Slide" />
                </div>
            </div>
        );
    }
}

export default Slideshow;
