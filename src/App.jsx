import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Canvas from "./components/Canvas/Canvas";
import Panel from "./components/Panel/Panel";
import Navbar from "./components/Navbar/Navbar";
import UserInfo from "./components/UserInfo/UserInfo";
import "./App.css";

const App = () => {
  const [elements, setElements] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [config, setConfig] = useState({});
  const [draggingElement, setDraggingElement] = useState(null);
  const [resizingElement, setResizingElement] = useState(null);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState("#ffffff");
  const [alignmentLine, setAlignmentLine] = useState(null);

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig((prevConfig) => ({ ...prevConfig, imageUrl: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("config", JSON.stringify(config));
  };

  const handleMouseDown = (e, id) => {
    setDraggingElement(id);
  };

  const handleMouseMove = (e) => {
    if (draggingElement) {
      const { clientX, clientY } = e;
      const canvasRect = e.currentTarget.getBoundingClientRect();
      let offsetX = clientX - canvasRect.left;
      let offsetY = clientY - canvasRect.top;

      const snapThreshold = 10;
      let alignment = null;

      elements.forEach((el) => {
        if (el.id !== draggingElement) {
          if (Math.abs(offsetY - el.position.y) < snapThreshold) {
            offsetY = el.position.y;
            alignment = { type: "horizontal", position: el.position.y };
          }
          if (Math.abs(offsetX - el.position.x) < snapThreshold) {
            offsetX = el.position.x;
            alignment = { type: "vertical", position: el.position.x };
          }
        }
      });

      setAlignmentLine(alignment);
      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === draggingElement
            ? { ...el, position: { x: offsetX, y: offsetY } }
            : el
        )
      );
    }

    if (resizingElement) {
      const { clientX, clientY } = e;
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const offsetX = clientX - canvasRect.left;
      const offsetY = clientY - canvasRect.top;

      setElements((prevElements) =>
        prevElements.map((el) =>
          el.id === resizingElement
            ? {
                ...el,
                size: {
                  width: offsetX - el.position.x,
                  height: offsetY - el.position.y,
                },
              }
            : el
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingElement(null);
    setResizingElement(null);
    setAlignmentLine(null);
  };

  const handleResizeMouseDown = (e, id) => {
    e.stopPropagation();
    setResizingElement(id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    const config = JSON.parse(e.dataTransfer.getData("config"));
    const newElement = {
      id: Date.now(),
      type,
      config,
      position: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
      size: type === "text" ? null : { width: config.width || 200, height: config.height || "auto" },
    };
    setElements((prev) => [...prev, newElement]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const removeAllElements = () => {
    setElements([]);
  };

  const handleBackgroundColorChange = (e) => {
    setCanvasBackgroundColor(e.target.value);
  };

  const Editor = () => (
    <div className="content-container">
      <Canvas
        elements={elements || []} // Ensure elements is always an array
        alignmentLine={alignmentLine}
        setElements={setElements}
        setAlignmentLine={setAlignmentLine}
        removeElement={removeElement}
        removeAllElements={removeAllElements}
        canvasBackgroundColor={canvasBackgroundColor}
        handleResizeMouseDown={handleResizeMouseDown}
      />
      <Panel
        selectedType={selectedType}
        config={config}
        handleConfigChange={handleConfigChange}
        handleFileChange={handleFileChange}
        handleDragStart={handleDragStart}
        setSelectedType={setSelectedType}
        handleBackgroundColorChange={handleBackgroundColorChange}
        elements={elements || []} // Ensure elements is always an array
        removeElement={removeElement}
      />
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <Navbar
          removeAllElements={removeAllElements}
          elements={elements || []} // Ensure elements is always an array
          setElements={setElements}
          canvasBackgroundColor={canvasBackgroundColor}
          handleBackgroundColorChange={handleBackgroundColorChange}
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