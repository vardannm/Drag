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
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [config, setConfig] = useState({});

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData("type", type);
    e.dataTransfer.setData("config", JSON.stringify(config));
    setConfig({}); // Reset config after drag
  };

  return (
    <div className="panel">
      <div className="type-buttons">
        <button onClick={() => setSelectedType("text")}>Add Text</button>
        <button onClick={() => setSelectedType("image")}>Add Image</button>
        <button onClick={() => setSelectedType("list")}>Add List</button>
      </div>

      {selectedType === "text" && (
        <TextConfig config={config} setConfig={setConfig} handleDragStart={handleDragStart} />
      )}
      {selectedType === "image" && (
        <ImageConfig config={config} setConfig={setConfig} handleDragStart={handleDragStart} />
      )}
      {selectedType === "list" && (
        <ListConfig config={config} setConfig={setConfig} handleDragStart={handleDragStart} />
      )}

      <div className="background-control">
        <label>
          Canvas Background:
          <input
            type="color"
            value={elements.canvasBackgroundColor || "#ffffff"}
            onChange={handleBackgroundColorChange}
          />
        </label>
      </div>

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