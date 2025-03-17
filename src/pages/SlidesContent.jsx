// SlidesContent.jsx
import React, { useState } from 'react';
import './SlidesContent.css';

// Available images (you can add more as needed)
const availableImages = [
  "/src/assets/slides/slide1.png",
      "/src/assets/slides/slide2.png",
      "/src/assets/slides/slide3.png",
      "/src/assets/slides/slide4.png",
      "/src/assets/slides/slide5.png"
];

// Initial slide data (can be empty or pre-populated)
const initialSlides = [
  {
    id: 1,
    name: 'Default Slide Set',
    images: [
      "/src/assets/slides/slide1.png",
      "/src/assets/slides/slide2.png",
      "/src/assets/slides/slide3.png",
      "/src/assets/slides/slide4.png",
      "/src/assets/slides/slide5.png"
    ],
  },
  {
    id: 2,
    name: 'Drive-Thru Promo',
    images: [
      "/src/assets/slides/slide1.png",
      "/src/assets/slides/slide2.png",
      "/src/assets/slides/slide3.png",
      "/src/assets/slides/slide4.png",
      "/src/assets/slides/slide5.png"
    ],
  },
];

function SlidesContent() {
  const [slides, setSlides] = useState(initialSlides);
  const [newSlideName, setNewSlideName] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleAddSlide = () => {
    if (newSlideName && selectedImages.length > 0) {
      const newSlide = {
        id: slides.length + 1,
        name: newSlideName,
        images: [...selectedImages],
      };
      setSlides([...slides, newSlide]);
      setNewSlideName('');
      setSelectedImages([]);
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
      
      {/* Create New Slide */}
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
              <img src={image} alt={`Option ${index + 1}`} className="thumbnail" />
            </div>
          ))}
        </div>
        <button onClick={handleAddSlide} className="add-slide-button">
          Add Slide
        </button>
      </div>

      {/* Existing Slides */}
      <div className="slides-list">
        <h2>Available Slides</h2>
        {slides.map(slide => (
          <div key={slide.id} className="slide-item">
            <h3>{slide.name}</h3>
            <div className="slide-images">
              {slide.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Slide ${idx + 1}`} className="thumbnail" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export the slides data (for simplicity, we'll export the initial data plus any new ones added)
export const getSlidesData = () => initialSlides; // This could be updated to return dynamic state if persisted

export default SlidesContent;