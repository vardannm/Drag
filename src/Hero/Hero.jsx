import  { useState, useEffect, useRef } from "react";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs";
import "./Hero.css";

function Hero() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userInfoRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

        <NavLink to="/device" className="sidebar-button">Device</NavLink>
        <NavLink to="/slides" className="sidebar-button">Slides</NavLink>
        <NavLink to="/templates" className="sidebar-button">Templates</NavLink>
      </div>

      <div className="content">
        <Breadcrumbs /> {/* Breadcrumbs at the top of content */}
        <Outlet />
      </div>
    </div>
  );
}

export default Hero;
