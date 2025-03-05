import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({
  removeAllElements,
  elements,
  setElements,
  canvasBackgroundColor,
  handleBackgroundColorChange,
  viewMode,
  toggleViewMode,
  canvasBackgroundImage, 
  handleBackgroundImageChange,
  canvasDimensions,
  handleDimensionChange,
  favoriteDimensions,
  saveFavoriteDimension,
  applyFavoriteDimension,
   saveFavoriteDesign, 
   favoriteDesigns, 
   applyFavoriteDesign, setCanvasBackgroundColor, setCanvasBackgroundImage, setCanvasDimensions
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const saveDesignToFile = () => {
    const design = {
      elements,
      canvasBackgroundColor,
      canvasBackgroundImage,
      canvasDimensions,
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `menu-design-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const loadDesignFromFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const design = JSON.parse(event.target.result);
        setElements(design.elements);
        setCanvasBackgroundColor(design.canvasBackgroundColor);
        setCanvasBackgroundImage(design.canvasBackgroundImage);
        setCanvasDimensions(design.canvasDimensions);
      };
      reader.readAsText(file);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-text">Canvas Editor</span>
      </div>
      <div className="navbar-controls">
        <button className="navbar-button view-mode-toggle" onClick={toggleViewMode}>
          {viewMode ? "Edit Mode" : "View Mode"}
        </button>
        <div className="navbar-color-picker">
          <label htmlFor="bgColor">Bg:</label>
          <input
            type="color"
            id="bgColor"
            value={canvasBackgroundColor}
            onChange={handleBackgroundColorChange}
          />
        </div>
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      {isMenuOpen && (
        <div className="navbar-dropdown">
          <div className="dropdown-section">
            <h4>Canvas Actions</h4>
            <button className="dropdown-button" onClick={removeAllElements}>
              Clear Canvas
            </button>
            <button className="dropdown-button" onClick={() => setElements([...elements])}>
              Save Design
            </button>
            <button className="dropdown-button" onClick={saveDesignToFile}>
              Export Design
            </button>
            <label className="dropdown-file-label">
              Import Design:
              <input type="file" accept=".json" onChange={loadDesignFromFile} />
            </label>
          </div>
          <div className="dropdown-section">
            <h4>Dimensions</h4>
            <div className="navbar-dimensions">
              <label>Width:</label>
              <input
                type="number"
                name="width"
                value={canvasDimensions.width}
                onChange={handleDimensionChange}
                min="100"
              />
              <label>Height:</label>
              <input
                type="number"
                name="height"
                value={canvasDimensions.height}
                onChange={handleDimensionChange}
                min="100"
              />
            </div>
            <button className="dropdown-button" onClick={saveFavoriteDimension}>
              Save as Favorite
            </button>
            {favoriteDimensions.length > 0 && (
              <select
                className="dropdown-select"
                onChange={(e) => applyFavoriteDimension(favoriteDimensions[e.target.value])}
              >
                <option value="">Select Favorite Dimension</option>
                {favoriteDimensions.map((dim, index) => (
                  <option key={dim.id} value={index}>{`${dim.width}x${dim.height}`}</option>
                ))}
              </select>
            )}
          </div>
          <div className="dropdown-section">
            <h4>Designs</h4>
            <button className="dropdown-button" onClick={saveFavoriteDesign}>
              Save Design
            </button>
            {favoriteDesigns.length > 0 && (
              <select
                className="dropdown-select"
                onChange={(e) => applyFavoriteDesign(favoriteDesigns[e.target.value])}
              >
                <option value="">Select Favorite Design</option>
                {favoriteDesigns.map((design, index) => (
                  <option key={design.id} value={index}>{`Design ${index + 1}`}</option>
                ))}
              </select>
            )}
          </div>
          <div className="dropdown-section">
            <h4>Navigation</h4>
            <Link to="/user-info" className="dropdown-button" onClick={toggleMenu}>
              User Info
            </Link>
          </div>
          <div className="dropdown-section">
            <h4>Background Image</h4>
            <label className="dropdown-file-label">
              Upload:
              <input type="file" accept="image/*" onChange={handleBackgroundImageChange} />
            </label>
            {canvasBackgroundImage && (
              <button
                className="dropdown-button"
                onClick={() => handleBackgroundImageChange({ target: { files: [] } })}
              >
                Remove Image
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;