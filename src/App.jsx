import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Canvas from "./components/Canvas/Canvas";
import Panel from "./components/Panel/Panel";
import UserInfo from "./components/UserInfo/UserInfo";
import "./App.css";

const App = () => {
  const [elements, setElements] = useState([]);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const [viewMode, setViewMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState(null);

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElementId === id) setSelectedElementId(null);
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
        viewMode={viewMode}
        selectedElementId={selectedElementId}
        setSelectedElementId={setSelectedElementId}
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
          viewMode={viewMode}
          toggleViewMode={toggleViewMode}
        />
        <Routes>
          <Route path="/" element={<Editor />} />
          <Route path="/user-info" element={<UserInfo />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;