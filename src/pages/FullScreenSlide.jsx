import React, { useState, useEffect } from 'react';
     import { useParams } from 'react-router-dom';
     import { fetchSlideByLink } from '../api/api';
     import './FullScreenSlide.css';

     function FullScreenSlide() {
       const { link } = useParams();
       const [image, setImage] = useState(null);
       const [error, setError] = useState(null);
       const [loading, setLoading] = useState(true);

       useEffect(() => {
         fetchSlideByLink(link)
           .then(data => {
             console.log('Fetched slide by link:', data);
             setImage(data.image);
             setLoading(false);
           })
           .catch(err => {
             console.error('Fetch slide by link error:', err);
             setError(err.message || 'Failed to load slide');
             setLoading(false);
           });
       }, [link]);

       if (loading) return <div>Loading...</div>;
       if (error) return <div>Error: {error}</div>;
       if (!image) return <div>Slide not found</div>;

       return (
         <div className="fullscreen-slide">
           <img src={image} alt="Full Screen Slide" className="fullscreen-image" />
         </div>
       );
     }

     export default FullScreenSlide;