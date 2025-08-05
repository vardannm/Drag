import React, { useState, useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';
     import { fetchDevices, createDevice, fetchSlides } from '../api/api';
     import './DeviceContent.css';

     function DeviceContent() {
       const navigate = useNavigate();
       const [devices, setDevices] = useState([]);
       const [slides, setSlides] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);
       const [showModal, setShowModal] = useState(false);
       const [deviceName, setDeviceName] = useState('');
       const [selectedSlideId, setSelectedSlideId] = useState('');
       const [generatedLink, setGeneratedLink] = useState('');

     useEffect(() => {
       setLoading(true);
       Promise.all([fetchDevices(), fetchSlides()])
         .then(([deviceData, slideData]) => {
           console.log('Fetched devices:', deviceData);
           console.log('Fetched slides:', slideData);
           setDevices(deviceData);
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
     }, [navigate]);

     const handleDeviceClick = (deviceId) => {
       navigate(`/app/device/${deviceId}`);
     };

     const handleAddDevice = () => {
       setShowModal(true);
     };

     const handleModalClose = () => {
       setShowModal(false);
       setDeviceName('');
       setSelectedSlideId('');
       setGeneratedLink('');
     };

     const handleCreateDevice = () => {
       if (!deviceName || !selectedSlideId) {
         setError('Device name and slide selection are required');
         return;
       }
       const newDevice = {
         name: deviceName,
         location: 'New Location',
         status: 'Active',
         selectedSlideId
       };
       createDevice(newDevice)
         .then(device => {
           console.log('Created device:', device);
           setDevices([...devices, device]);
           setGeneratedLink(`http://localhost:5174/slide/${device.link}`);
           setDeviceName('');
           setSelectedSlideId('');
         })
         .catch(err => {
           console.error('Create device error:', err);
           setError(err.message || 'Failed to create device');
           if (err.response?.status === 401) {
             navigate('/');
           }
         });
     };

     if (loading) {
       return <div>Loading devices...</div>;
     }

     if (error) {
       return <div>Error: {error}</div>;
     }

     return (
       <div className="device-content">
         <div className="header-section">
           <h1>Devices</h1>
           <button className="add-screen-button" onClick={handleAddDevice}>Add New Screen</button>
         </div>
         {showModal && (
           <div className="modal">
             <div className="modal-content">
               <h2>Create New Device</h2>
               <input
                 type="text"
                 placeholder="Device Name"
                 value={deviceName}
                 onChange={(e) => setDeviceName(e.target.value)}
                 className="modal-input"
               />
               <select
                 value={selectedSlideId}
                 onChange={(e) => setSelectedSlideId(e.target.value)}
                 className="modal-select"
               >
                 <option value="">Select a Slide</option>
                 {slides.map(slide => (
                   <option key={slide._id} value={slide._id}>
                     {slide.name}
                   </option>
                 ))}
               </select>
               <div className="modal-buttons">
                 <button onClick={handleCreateDevice} className="modal-button">Create</button>
                 <button onClick={handleModalClose} className="modal-button cancel">Cancel</button>
               </div>
               {generatedLink && (
                 <div className="generated-link">
                   <p>Shareable Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a></p>
                 </div>
               )}
             </div>
           </div>
         )}
         <div className="screen-grid">
           {devices.length === 0 ? (
             <p>No devices found. Click "Add New Screen" to create one.</p>
           ) : (
             devices.map(device => (
               <div
                 key={device._id}
                 className="screen-card"
                 onClick={() => handleDeviceClick(device._id)}
               >
                 <h3>{device.name}</h3>
                 <p>Location: {device.location}</p>
                 <p>Status:
                   <span className={device.status === 'Active' ? 'status-active' : 'status-inactive'}>
                     {device.status}
                   </span>
                 </p>
                 <p>Last Update: {device.lastUpdate || 'N/A'}</p>
               </div>
             ))
           )}
         </div>
       </div>
     );
     }

     export default DeviceContent;