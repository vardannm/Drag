import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import DeviceJson from '../data/DeviceData.json'
import './DeviceDetail.css';
function DeviceDetail() {
  const { id } = useParams(); // Get device ID from URL
  const navigate = useNavigate();
  
  // Find the device using the ID from the URL
  const device = DeviceJson.find(device => device.id === parseInt(id));

  // If the device is not found, you can display a fallback message
  if (!device) {
    return <p>Device not found</p>;
  }

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const handleBackClick = () => {
    navigate('/device'); // Go back to device list
  };

  return (
    <div className="device-detail">
      <button className="back-button" onClick={handleBackClick}>Back to Devices</button>
      <h2>{device.name} - Active Slide</h2>
      <div className="slide-view">
        <Slider {...settings}>
          {device.images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Slide ${index + 1}`} className="slide-image" />
            </div>
          ))}
        </Slider>
      </div>
      <p>Location: {device.location}</p>
      <p>Status: {device.status}</p>
      <p>Last Update: {device.lastUpdate}</p>
      <div></div>
    </div>
  );
}

export default DeviceDetail;
