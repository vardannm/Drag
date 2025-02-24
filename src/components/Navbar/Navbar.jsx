// src/components/Navbar/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({
  removeAllElements,
  elements,
  setElements,
  canvasBackgroundColor,
  handleBackgroundColorChange,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-text">Canvas Editor</span>
      </div>
      <div className="navbar-menu">
        <Link to="/user-info" className="navbar-button">
          User Info
        </Link>
        <button className="navbar-button" onClick={removeAllElements}>
          Clear Canvas
        </button>
        <button
          className="navbar-button"
          onClick={() => setElements([...elements])}
        >
          Save Design
        </button>
        <div className="navbar-color-picker">
          <label htmlFor="bgColor">Background:</label>
          <input
            type="color"
            id="bgColor"
            value={canvasBackgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;