import React, { useState, useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';
     import { fetchDevices, createDevice } from '../api/api';
     import './DeviceContent.css';

     function DeviceContent() {
       const navigate = useNavigate();
       const [devices, setDevices] = useState([]);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
         setLoading(true);
         fetchDevices()
           .then(data => {
             console.log('Fetched devices:', data);
             setDevices(data);
             setLoading(false);
           })
           .catch(err => {
             console.error('Fetch devices error:', err);
             setError(err.message || 'Failed to load devices');
             setLoading(false);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       }, [navigate]);

       const handleDeviceClick = (screenId) => {
         navigate(`/app/device/${screenId}`);
       };

       const handleAddDevice = () => {
         const newDevice = {
           id: devices.length + 1,
           name: `Screen ${devices.length + 1}`,
           location: 'New Location',
           status: 'Active',
           selectedSlideId: 1
         };
         createDevice(newDevice)
           .then(device => {
             console.log('Created device:', device);
             setDevices([...devices, device]);
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
           <div className="screen-grid">
             {devices.length === 0 ? (
               <p>No devices found. Click "Add New Screen" to create one.</p>
             ) : (
               devices.map(screen => (
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
                   <p>Last Update: {screen.lastUpdate || 'N/A'}</p>
                 </div>
               ))
             )}
           </div>
         </div>
       );
     }

     export default DeviceContent;