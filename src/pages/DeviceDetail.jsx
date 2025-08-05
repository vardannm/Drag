import React, { useState, useEffect } from 'react';
     import { useParams, useNavigate } from 'react-router-dom';
     import { fetchDevice, fetchSlides, updateDevice } from '../api/api';
     import './DeviceDetail.css';

     function DeviceDetail() {
       const { id } = useParams();
       const navigate = useNavigate();
       const [device, setDevice] = useState(null);
       const [slides, setSlides] = useState([]);
       const [selectedSlideId, setSelectedSlideId] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
         setLoading(true);
         Promise.all([fetchDevice(id), fetchSlides()])
           .then(([deviceData, slideData]) => {
             if (deviceData.error) {
               setDevice(null);
             } else {
               setDevice(deviceData);
               setSelectedSlideId(deviceData.selectedSlideId?._id || null);
             }
             setSlides(slideData);
             setLoading(false);
           })
           .catch(err => {
             console.error('Fetch error:', err);
             setError(err.message || 'Failed to load data');
             setLoading(false);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       }, [id, navigate]);

       if (loading) return <div>Loading...</div>;
       if (error) return <div>Error: {error}</div>;
       if (!device) return <p>Device not found</p>;

       const selectedSlide = slides.find(slide => slide._id === selectedSlideId);

       const handleBackClick = () => {
         navigate('/app/device');
       };

       const handleSlideChange = (e) => {
         const newSlideId = e.target.value;
         setSelectedSlideId(newSlideId);
         updateDevice(id, { ...device, selectedSlideId: newSlideId })
           .then(updatedDevice => setDevice(updatedDevice))
           .catch(err => {
             console.error('Update device error:', err);
             setError(err.message || 'Failed to update device');
           });
       };

       return (
         <div className="device-detail">
           <button className="back-button" onClick={handleBackClick}>Back to Devices</button>
           <h2>{device.name} - Active Slide</h2>
           <div className="slide-view">
             {selectedSlide ? (
               <img
                 src={selectedSlide.image}
                 alt={selectedSlide.name}
                 className="slide-image"
               />
             ) : (
               <p>No slide selected</p>
             )}
           </div>
           <div className="slide-selector">
             <h3>Choose Slide:</h3>
             <select value={selectedSlideId || ''} onChange={handleSlideChange}>
               <option value="">Select a Slide</option>
               {slides.map(slide => (
                 <option key={slide._id} value={slide._id}>
                   {slide.name}
                 </option>
               ))}
             </select>
           </div>
           <p>Location: {device.location}</p>
           <p>Status: {device.status}</p>
           <p>Last Update: {device.lastUpdate || 'N/A'}</p>
           {device.link && (
             <p>
               Shareable Link: <a href={`/slide/${device.link}`} target="_blank" rel="noopener noreferrer">{`/slide/${device.link}`}</a>
             </p>
           )}
         </div>
       );
     }

     export default DeviceDetail;