import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import "./Hero.css";
import DeviceContent from '../pages/Device';
import SlidesContent from '../pages/SlidesContent';
import TemplatesContent from '../pages/TemplatesContent';
import App from '../App';
function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('welcome'); // Default to welcome content
  const dropdownRef = useRef(null); 
  const userInfoRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        userInfoRef.current &&
        !userInfoRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="hero-container">
      <div className="sidebar">
        <div className="user-info" onClick={toggleDropdown} ref={userInfoRef}>
          <span className="user-name">John Doe</span>
          <div className="user-icon">
            <FaUser />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <div className="dropdown-item">
              <FaUser className="dropdown-icon" />
              <span>Profile</span>
            </div>
            <div className="dropdown-item">
              <FaSignOutAlt className="dropdown-icon" />
              <span>Log Out</span>
            </div>
          </div>
        )}

        <button className="sidebar-button" onClick={() => handleButtonClick('device')}>Device</button>
        <button className="sidebar-button" onClick={() => handleButtonClick('slides')}>Slides</button>
        <button className="sidebar-button" onClick={() => handleButtonClick('templates')}>Templates</button>
      </div>

      <div className="content">
        {activeContent === 'welcome' && (
          <div className='content-text'>
            <h1>Welcome to ScreenCanvas</h1>
            <p>We control</p>
          </div>
        )}
        {activeContent === 'device' && <DeviceContent />}
        {activeContent === 'slides' && <SlidesContent />}
        {activeContent === 'templates' && <TemplatesContent />}
      </div>
    </div>
  );
}

export default Hero;