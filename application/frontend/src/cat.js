import React from "react";
import "./about.css";

const cat = () => {
  return (
    <div className="container">
      <h1>Cat Tuong Vu</h1>
      <h2>Hi, I'm a Frontend Developer</h2>
      <p>
        My name is Cat Vu, or Kate. I was born and raised in Vietnam, I’m
        currently studying Computer Science at the San Francisco State
        University. I started web design and development about one year ago and
        have been enjoying working and developing my skill in both art and
        science aspects. I hope to get myself into exploring the frontend
        industry even more in future. If you want to know more about me, click
        the button below!
      </p>
      <a href="/" className="btn">
        Get In Touch
      </a>
    </div>
  );
};

export default cat;
