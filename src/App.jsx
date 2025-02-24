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

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const removeAllElements = () => {
    setElements([]);
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
      console.log("Toggling viewMode, new value:", !prev); // Debug log
      return !prev;
    });
  };

  const Editor = () => (
    <div className="editor-container">
      <Canvas
        elements={elements}
        setElements={setElements}
        removeElement={removeElement}
        removeAllElements={removeAllElements}
        updateElement={updateElement}
        canvasBackgroundColor={canvasBackgroundColor}
        viewMode={viewMode}
      />
      <Panel
        setElements={setElements}
        elements={elements}
        removeElement={removeElement}
        handleBackgroundColorChange={handleBackgroundColorChange}
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