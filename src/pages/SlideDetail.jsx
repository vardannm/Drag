import React, { useState, useEffect } from 'react';
     import { useParams, useNavigate } from 'react-router-dom';
     import { fetchSlide } from '../api/api';
     import './SlideDetail.css';

     function SlideDetail() {
       const { id } = useParams();
       const navigate = useNavigate();
       const [slide, setSlide] = useState(null);
       const [loading, setLoading] = useState(true);
       const [error, setError] = useState(null);

       useEffect(() => {
         fetchSlide(id)
           .then(data => {
             console.log('Fetched slide:', data);
             setSlide(data);
             setLoading(false);
           })
           .catch(err => {
             console.error('Fetch slide error:', err);
             setError(err.message);
             setLoading(false);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       }, [id, navigate]);

       if (loading) return <div>Loading...</div>;
       if (error) return <div>Error: {error}</div>;
       if (!slide) return <div>Slide not found</div>;

       return (
         <div className="slide-detail">
           <h1>{slide.name}</h1>
           <img src={slide.image} alt={slide.name} className="slide-image" />
           {slide.templateIds?.length ? (
             <p>Created from: {slide.templateIds.map(t => t.name).join(', ')}</p>
           ) : (
             <p>No templates used</p>
           )}
           <button onClick={() => navigate('/app/slides')} className="back-button">
             Back to Slides
           </button>
         </div>
       );
     }

     export default SlideDetail;