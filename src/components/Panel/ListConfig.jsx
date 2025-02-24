import React, { useState } from "react";

const ListConfig = ({ config, setConfig, handleDragStart }) => {
  const [items, setItems] = useState(config.items || []);

  const addItem = () => {
    const newItem = { text: "", color: "#000000" };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setConfig((prev) => ({ ...prev, items: updatedItems }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
    setConfig((prev) => ({ ...prev, items: updatedItems }));
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    setConfig((prev) => ({ ...prev, items: updatedItems }));
  };

  return (
    <div className="config-section">
      <h4>List Configuration</h4>
      <div className="list-items">
        {items.map((item, index) => (
          <div key={index} className="list-item-config">
            <input
              type="text"
              placeholder={`Item ${index + 1}`}
              value={item.text}
              onChange={(e) => updateItem(index, "text", e.target.value)}
            />
            <label>
              Color:
              <input
                type="color"
                value={item.color}
                onChange={(e) => updateItem(index, "color", e.target.value)}
              />
            </label>
            <button onClick={() => removeItem(index)}>×</button>
          </div>
        ))}
        <button onClick={addItem}>Add Item</button>
      </div>
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, "list")}
      >
        Drag List to Canvas
      </button>
    </div>
  );
};

export default ListConfig;