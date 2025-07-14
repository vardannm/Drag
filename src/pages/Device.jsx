import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeviceContent.css';
import DeviceJson from '../data/DeviceData.json';

function DeviceContent() {
  const navigate = useNavigate();

  const handleDeviceClick = (screenId) => {
    navigate(`/device/${screenId}`);
  };

  return (
    <div className="device-content">
      <div className="header-section">
        <h1>Devices</h1>
        <button className="add-screen-button">Add New Screen</button>
      </div>
      <div className="screen-grid">
        {DeviceJson.map(screen => (
          <div 
            key={screen.id} 
            className="screen-card" 
            onClick={() => handleDeviceClick(screen.id)} 
          >
            <h3>{screen.name}</h3>
            <p>Location: {screen.location}</p>
            <p>Status: 
              <span className={screen.status === 'Active' ? 'status-active' : 'status-inactive'}>
                {screen.status}
              </span>
            </p>
            <p>Last Update: {screen.lastUpdate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeviceContent;
