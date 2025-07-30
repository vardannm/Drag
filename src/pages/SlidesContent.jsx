import React, { useState, useEffect } from 'react';
  import { fetchSlides, createSlide } from '../api/api';
  import './SlidesContent.css';

  function SlidesContent() {
    const [slides, setSlides] = useState([]);
    const [newSlideName, setNewSlideName] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [availableImages, setAvailableImages] = useState([
      '/slides/slide1.png',
      '/slides/slide2.png',
      '/slides/slide3.png',
      '/slides/slide4.png',
      '/slides/slide5.png'
    ]);

    useEffect(() => {
      fetchSlides().then(data => setSlides(data)).catch(err => console.error(err));
    }, []);

    const handleAddSlide = () => {
      if (newSlideName && selectedImages.length > 0) {
        const newSlide = {
          id: slides.length + 1,
          name: newSlideName,
          images: [...selectedImages]
        };
        createSlide(newSlide).then(slide => {
          setSlides([...slides, slide]);
          setNewSlideName('');
          setSelectedImages([]);
        }).catch(err => console.error(err));
      }
    };

    const handleImageToggle = (image) => {
      if (selectedImages.includes(image)) {
        setSelectedImages(selectedImages.filter(img => img !== image));
      } else {
        setSelectedImages([...selectedImages, image]);
      }
    };

    return (
      <div className="slides-content">
        <h1>Manage Slides</h1>
        <div className="slide-creator">
          <h2>Create New Slide</h2>
          <input
            type="text"
            value={newSlideName}
            onChange={(e) => setNewSlideName(e.target.value)}
            placeholder="Slide Name"
            className="slide-name-input"
          />
          <div className="image-selector">
            {availableImages.map((image, index) => (
              <div key={index} className="image-option">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image)}
                  onChange={() => handleImageToggle(image)}
                />
                <img src={`http://localhost:5000${image}`} alt={`Option ${index + 1}`} className="thumbnail" />
              </div>
            ))}
          </div>
          <button onClick={handleAddSlide} className="add-slide-button">
            Add Slide
          </button>
        </div>
        <div className="slides-list">
          <h2>Available Slides</h2>
          {slides.map(slide => (
            <div key={slide.id} className="slide-item">
              <h3>{slide.name}</h3>
              <div className="slide-images">
                {slide.images.map((img, idx) => (
                  <img key={idx} src={`http://localhost:5000${img}`} alt={`Slide ${idx + 1}`} className="thumbnail" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  export default SlidesContent;