import React, { useState, useEffect } from 'react';
     import { useParams, useNavigate } from 'react-router-dom';
     import Slider from 'react-slick';
     import { fetchDevice, fetchSlides, updateDevice } from '../api/api';
     import './DeviceDetail.css';

     function DeviceDetail() {
       const { id } = useParams();
       const navigate = useNavigate();
       const [device, setDevice] = useState(null);
       const [slides, setSlides] = useState([]);
       const [selectedSlideId, setSelectedSlideId] = useState(null);

       useEffect(() => {
         fetchDevice(id)
           .then(data => {
             if (data.error) {
               setDevice(null);
             } else {
               setDevice(data);
               setSelectedSlideId(data.selectedSlideId);
             }
           })
           .catch(err => {
             console.error(err);
             if (err.response?.status === 401) {
               navigate('/'); // Redirect to login if unauthorized
             }
           });

         fetchSlides()
           .then(data => setSlides(data))
           .catch(err => console.error(err));
       }, [id, navigate]);

       if (!device) {
         return <p>Device not found</p>;
       }

       const selectedSlide = slides.find(slide => slide.id === selectedSlideId);

       const settings = {
         dots: true,
         infinite: true,
         speed: 500,
         slidesToShow: 1,
         slidesToScroll: 1,
       };

       const handleBackClick = () => {
         navigate('/app/device');
       };

       const handleSlideChange = (e) => {
         const newSlideId = parseInt(e.target.value);
         setSelectedSlideId(newSlideId);
         updateDevice(id, { ...device, selectedSlideId: newSlideId })
           .then(updatedDevice => setDevice(updatedDevice))
           .catch(err => console.error(err));
       };

       return (
         <div className="device-detail">
           <button className="back-button" onClick={handleBackClick}>Back to Devices</button>
           <h2>{device.name} - Active Slide</h2>
           <div className="slide-view">
             {selectedSlide && (
               <Slider {...settings}>
                 {selectedSlide.images.map((image, index) => (
                   <div key={index}>
                     <img
                       src={`http://localhost:5000${image}`}
                       alt={`Slide ${index + 1}`}
                       className="slide-image"
                     />
                   </div>
                 ))}
               </Slider>
             )}
           </div>
           <div className="slide-selector">
             <h3>Choose Slide:</h3>
             <select value={selectedSlideId || ''} onChange={handleSlideChange}>
               {slides.map(slide => (
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