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
  setSelectedElementId,
  updateElement,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [newElementConfig, setNewElementConfig] = useState({
    content: "",
    color: "#000000",
    fontSize: "16",
    fontWeight: "normal",
  });
  const [editingElementId, setEditingElementId] = useState(null);

  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const editingElement = elements.find((el) => el.id === editingElementId);

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
    if (editingElement) {
      updateElement(editingElement.id, { config: { ...editingElement.config, ...newConfig } });
    } else if (selectedElement) {
      updateElement(selectedElement.id, { config: { ...selectedElement.config, ...newConfig } });
    } else {
      setNewElementConfig(newConfig);
    }
  };

  const deselectElement = () => {
    setSelectedType(null);
    setEditingElementId(null);
    setNewElementConfig({
      content: "",
      color: "#000000",
      fontSize: "16",
      fontWeight: "normal",
    });
    setSelectedElementId(null);
  };

  const handleEditClick = (elementId) => {
    setEditingElementId(elementId);
    setSelectedElementId(elementId);
    const element = elements.find((el) => el.id === elementId);
    setSelectedType(element.type);
  };

  const handleSave = () => {
    setEditingElementId(null);
    setSelectedType(null);
  };

  const handleClose = () => {
    setEditingElementId(null);
    setSelectedType(null);
    setSelectedElementId(null);
  };

  return (
    <div className="panel">
      {editingElement ? (
        <div className="selected-element-config">
          <h3>Edit {editingElement.type.charAt(0).toUpperCase() + editingElement.type.slice(1)}</h3>
          {editingElement.type === "text" && (
            <TextConfig
              config={editingElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          {editingElement.type === "image" && (
            <ImageConfig
              config={editingElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          {editingElement.type === "list" && (
            <ListConfig
              config={editingElement.config}
              setConfig={handleConfigChange}
              handleDragStart={handleDragStart}
              isEditingExisting={true}
            />
          )}
          <div className="edit-controls">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      ) : selectedElement ? (
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
              <button onClick={() => handleEditClick(el.id)}>Edit</button>
              <button onClick={() => removeElement(el.id)}>Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Panel;