import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Canvas from "./components/Canvas/Canvas";
import Panel from "./components/Panel/Panel";
import UserInfo from "./components/UserInfo/UserInfo";
import { useLocation } from "react-router-dom";
import './Template.css'
import coffeeMenu from "../../../Downloads/menu-design-1741177484759.json";
import fastFoodCombo from "../../../Downloads/menu-design-1741177538337.json";
const templateData = {
  1: coffeeMenu, // Match id from TemplatesContent.jsx
  2: fastFoodCombo,
};
function Template() {
  const location = useLocation();
  const { templateId } = location.pathname.split("/").filter(Boolean).pop(); // Extract id from /templates/:templateId
  const isNewTemplate = location.pathname === "/templates/new";
  const templatePath = location.state?.templatePath; // Get path from state (not used here with static imports)

  const [elements, setElements] = useState([]);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const [canvasBackgroundImage, setCanvasBackgroundImage] = useState(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });
  const [viewMode, setViewMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [favoriteDimensions, setFavoriteDimensions] = useState([]);
  const [favoriteDesigns, setFavoriteDesigns] = useState([]);

  // Load template data when templateId matches
  useEffect(() => {
    if (templateId && templateData[templateId]) {
      const design = templateData[templateId];
      setElements(design.elements || []);
      setCanvasBackgroundColor(design.canvasBackgroundColor || "#ffffff");
      setCanvasBackgroundImage(design.canvasBackgroundImage || null);
      setCanvasDimensions(design.canvasDimensions || { width: 800, height: 600 });
    }
  }, [templateId]);

  const addOrDuplicateElement = (type, config, { isDuplicate, originalElement }) => {
    const newElement = {
      id: Date.now(),
      type,
      config,
      position: isDuplicate
        ? { x: originalElement.position.x + 20, y: originalElement.position.y + 20 }
        : { x: 50, y: 50 },
      size: { width: 200, height: 200 },
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const removeAllElements = () => {
    setElements([]);
  };

  const updateElement = (id, updates) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const handleBackgroundColorChange = (e) => {
    setCanvasBackgroundColor(e.target.value);
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCanvasBackgroundImage(url);
    } else {
      setCanvasBackgroundImage(null);
    }
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setCanvasDimensions((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const saveFavoriteDimension = () => {
    setFavoriteDimensions([...favoriteDimensions, { ...canvasDimensions, id: Date.now() }]);
  };

  const applyFavoriteDimension = (dim) => {
    setCanvasDimensions({ width: dim.width, height: dim.height });
  };

  const saveFavoriteDesign = () => {
    const design = { elements, canvasBackgroundColor, canvasDimensions, id: Date.now() };
    setFavoriteDesigns([...favoriteDesigns, design]);
  };

  const applyFavoriteDesign = (design) => {
    setElements(design.elements);
    setCanvasBackgroundColor(design.canvasBackgroundColor);
    setCanvasDimensions(design.canvasDimensions);
  };

  const toggleViewMode = () => {
    setViewMode(!viewMode);
  };

  return (
    <div className="template-editor">
      <Navbar
        removeAllElements={removeAllElements}
        elements={elements}
        setElements={setElements}
        canvasBackgroundColor={canvasBackgroundColor}
        handleBackgroundColorChange={handleBackgroundColorChange}
        viewMode={viewMode}
        toggleViewMode={toggleViewMode}
        canvasBackgroundImage={canvasBackgroundImage}
        handleBackgroundImageChange={handleBackgroundImageChange}
        canvasDimensions={canvasDimensions}
        handleDimensionChange={handleDimensionChange}
        favoriteDimensions={favoriteDimensions}
        saveFavoriteDimension={saveFavoriteDimension}
        applyFavoriteDimension={applyFavoriteDimension}
        saveFavoriteDesign={saveFavoriteDesign}
        favoriteDesigns={favoriteDesigns}
        applyFavoriteDesign={applyFavoriteDesign}
        setCanvasBackgroundColor={setCanvasBackgroundColor}
        setCanvasBackgroundImage={setCanvasBackgroundImage}
        setCanvasDimensions={setCanvasDimensions}
      />
      <div className="editor-container">
        
          <Panel
            setElements={setElements}
            elements={elements}
            removeElement={removeElement}
            handleBackgroundColorChange={handleBackgroundColorChange}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
            updateElement={updateElement}
          />
        
        <Canvas
          elements={elements}
          setElements={setElements}
          addOrDuplicateElement={addOrDuplicateElement}
          removeElement={removeElement}
          removeAllElements={removeAllElements}
          updateElement={updateElement}
          canvasBackgroundColor={canvasBackgroundColor}
          viewMode={viewMode}
          selectedElementId={selectedElementId}
          setSelectedElementId={setSelectedElementId}
          canvasBackgroundImage={canvasBackgroundImage}
          canvasDimensions={canvasDimensions}
        />
      </div>
    </div>
  );
}

export default Template;