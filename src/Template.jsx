import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Canvas from "./components/Canvas/Canvas";
import Panel from "./components/Panel/Panel";
import UserInfo from "./components/UserInfo/UserInfo";
function Template() {
    const [canvasBackgroundImage, setCanvasBackgroundImage] = useState(null); 
    const [elements, setElements] = useState([]);
    const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
    const [viewMode, setViewMode] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState(null);
    const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
    const [favoriteDimensions, setFavoriteDimensions] = useState(
      JSON.parse(localStorage.getItem("favoriteDimensions")) || []
    );
    const [favoriteDesigns, setFavoriteDesigns] = useState(
      JSON.parse(localStorage.getItem("favoriteDesigns")) || []
    );
    const handleBackgroundImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => setCanvasBackgroundImage(event.target.result);
        reader.readAsDataURL(file);
      }
    };
    const saveFavoriteDesign = () => {
      const design = {
        id: Date.now(),
        elements,
        canvasBackgroundColor,
        canvasBackgroundImage,
        canvasDimensions,
      };
      const updatedDesigns = [...favoriteDesigns, design];
      setFavoriteDesigns(updatedDesigns);
      localStorage.setItem("favoriteDesigns", JSON.stringify(updatedDesigns));
    };
    const applyFavoriteDesign = (design) => {
      setElements(design.elements);
      setCanvasBackgroundColor(design.canvasBackgroundColor);
      setCanvasBackgroundImage(design.canvasBackgroundImage);
      setCanvasDimensions(design.canvasDimensions);
    };
    const removeElement = (id) => {
      setElements((prev) => prev.filter((el) => el.id !== id));
      if (selectedElementId === id) setSelectedElementId(null);
    };
    const handleDimensionChange = (e) => {
      const { name, value } = e.target;
      setCanvasDimensions((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    };
  
    const removeAllElements = () => {
      setElements([]);
      setSelectedElementId(null);
    };
  
    const updateElement = (id, updates) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    };
  
    const handleBackgroundColorChange = (e) => {
      setCanvasBackgroundColor(e.target.value);
    };
  
    const toggleViewMode = () => {
      setViewMode((prev) => {
        console.log("Toggling viewMode, new value:", !prev);
        return !prev;
      });
    };
    const saveFavoriteDimension = () => {
      const newFavorite = { ...canvasDimensions, id: Date.now() };
      const updatedFavorites = [...favoriteDimensions, newFavorite];
      setFavoriteDimensions(updatedFavorites);
      localStorage.setItem("favoriteDimensions", JSON.stringify(updatedFavorites));
    };
  
    const applyFavoriteDimension = (dim) => {
      setCanvasDimensions({ width: dim.width, height: dim.height });
    };
  
    const addOrDuplicateElement = (type, config, options = {}) => {
      const { isDuplicate = false, originalElement = null } = options;
      const newElement = isDuplicate && originalElement
        ? {
            ...originalElement,
            id: Date.now(),
            position: {
              x: originalElement.position.x + 20,
              y: originalElement.position.y + 20,
            },
          }
        : {
            id: Date.now(),
            type,
            config: {
              ...config,
              ...(type === "text" && {
                content: config.content !== undefined ? config.content : "",
                color: config.color !== undefined ? config.color : "#000000",
                fontSize: config.fontSize !== undefined ? config.fontSize : "16",
                fontWeight: config.fontWeight !== undefined ? config.fontWeight : "normal",
              }),
            },
            position: { x: 50, y: 50 },
            size: type === "text" || type === "list" ? null : { width: 200, height: 200 },
            rotation: 0,
          };
      setElements((prev) => [...prev, newElement]);
    };
  
    const Editor = () => (
      <div className="editor-container">
        <Canvas
          elements={elements}
          setElements={setElements}
          addOrDuplicateElement={addOrDuplicateElement}
          removeElement={removeElement}
          removeAllElements={removeAllElements}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          canvasBackgroundImage={canvasBackgroundImage}
            handleBackgroundImageChange={handleBackgroundImageChange}
          viewMode={viewMode}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
          canvasDimensions={canvasDimensions}
        />
        <Panel
          setElements={addOrDuplicateElement}
          elements={elements}
          removeElement={removeElement}
          handleBackgroundColorChange={handleBackgroundColorChange}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId} // Add this prop
          updateElement={updateElement}
        />
      </div>
    );
  
    return (
      <Router>
        <div className="app-container">
          <Navbar
            removeAllElements={removeAllElements}
            elements={elements}
            setElements={setElements}
            canvasBackgroundColor={canvasBackgroundColor}
            handleBackgroundColorChange={handleBackgroundColorChange}
            handleBackgroundImageChange={handleBackgroundImageChange}
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
            canvasDimensions={canvasDimensions}
            handleDimensionChange={handleDimensionChange}
            favoriteDimensions={favoriteDimensions}
            saveFavoriteDimension={saveFavoriteDimension}
            applyFavoriteDimension={applyFavoriteDimension}
            saveFavoriteDesign={saveFavoriteDesign}
            favoriteDesigns={favoriteDesigns}
            applyFavoriteDesign={applyFavoriteDesign}
          />
          <Routes>
            <Route path="/" element={<Editor />} />
            <Route path="/user-info" element={<UserInfo />} />
          </Routes>
        </div>
      </Router>
    );
}

export default Template