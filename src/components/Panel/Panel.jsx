import React, { useState } from "react";
import TextConfig from "./TextConfig";
import ImageConfig from "./ImageConfig";
import ListConfig from "./ListConfig";
import "./Panel.css";

const Panel = ({
  setElements,
  elements,
  removeElement,
  handleBackgroundColorChange,
  selectedElementId,
  setSelectedElementId, // Add this prop
  updateElement,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [newElementConfig, setNewElementConfig] = useState({
    content: "",
    color: "#000000",
    fontSize: "16",
    fontWeight: "normal",
  });

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("config", JSON.stringify(newElementConfig));
    setNewElementConfig({
      content: "",
      color: "#000000",
      fontSize: "16",
      fontWeight: "normal",
    });
  };

  const handleConfigChange = (newConfig) => {
    if (selectedElement) {
      updateElement(selectedElement.id, { config: { ...selectedElement.config, ...newConfig } });
    } else {
      setNewElementConfig(newConfig);
    }
  };

  const deselectElement = () => {
    setSelectedType(null); // Reset to add mode
    setNewElementConfig({
      content: "",
      color: "#000000",
      fontSize: "16",
      fontWeight: "normal",
    });
    setSelectedElementId(null); // Clear the selected element ID
  };

  return (
    <div className="panel">
      {selectedElement ? (
        <div className="selected-element-config">
          <h3>Edit {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}</h3>
          {selectedElement.type === "text" && (
            <TextConfig
              config={selectedElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          {selectedElement.type === "image" && (
            <ImageConfig
              config={selectedElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          {selectedElement.type === "list" && (
            <ListConfig
              config={selectedElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          <button onClick={deselectElement}>Add New Element</button>
        </div>
      ) : (
        <>
          <div className="type-buttons">
            <button onClick={() => setSelectedType("text")}>Add Text</button>
            <button onClick={() => setSelectedType("image")}>Add Image</button>
            <button onClick={() => setSelectedType("list")}>Add List</button>
          </div>

          {selectedType === "text" && (
            <TextConfig
              config={newElementConfig}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={false}
            />
          )}
          {selectedType === "image" && (
            <ImageConfig
              config={newElementConfig}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={false}
            />
          )}
          {selectedType === "list" && (
            <ListConfig
              config={newElementConfig}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={false}
            />
          )}
        </>
      )}

      <div className="elements-list">
        <h3>Elements on Canvas</h3>
        {elements.length === 0 ? (
          <p>No elements yet</p>
        ) : (
          elements.map((el) => (
            <div key={el.id} className="element-item">
              <span>
                {el.type === "text" && `Text: ${el.config.content || "Untitled"}`}
                {el.type === "image" && `Image: ${el.config.imageUrl?.split('/').pop() || "Unnamed"}`}
                {el.type === "list" && `List: ${el.config.items?.length || 0} items`}
              </span>
              <button onClick={() => removeElement(el.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Panel;