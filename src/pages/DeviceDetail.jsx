
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import DeviceJson from '../data/DeviceData.json';
import { getSlidesData } from '../pages/SlidesContent'; 
import './DeviceDetail.css';

function DeviceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const device = DeviceJson.find(device => device.id === parseInt(id));
  const availableSlides = getSlidesData();
  const [selectedSlideId, setSelectedSlideId] = useState(device.selectedSlideId || availableSlides[0].id); 

  if (!device) {
    return <p>Device not found</p>;
  }

  const selectedSlide = availableSlides.find(slide => slide.id === selectedSlideId);


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleBackClick = () => {
    navigate('/device');
  };

  const handleSlideChange = (e) => {
    setSelectedSlideId(parseInt(e.target.value));
  };

  return (
    <div className="device-detail">
      <button className="back-button" onClick={handleBackClick}>Back to Devices</button>
      <h2>{device.name} - Active Slide</h2>
      <div className="slide-view">
        <Slider {...settings}>
          {selectedSlide.images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Slide ${index + 1}`} className="slide-image" />
            </div>
          ))}
        </Slider>
      </div>
      

      <div className="slide-selector">
        <h3>Choose Slide:</h3>
        <select value={selectedSlideId} onChange={handleSlideChange}>
          {availableSlides.map(slide => (
            <option key={slide.id} value={slide.id}>
              {slide.name}
            </option>
          ))}
        </select>
      </div>

      <p>Location: {device.location}</p>
      <p>Status: {device.status}</p>
      <p>Last Update: {device.lastUpdate}</p>
    </div>
  );
}

export default DeviceDetail;