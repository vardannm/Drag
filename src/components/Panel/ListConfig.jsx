import React, { useState } from "react";
import PropTypes from "prop-types";

const ListConfig = ({ config, handleConfigChange, handleDragStart }) => {
  const [items, setItems] = useState(config.items || []);

  const addItem = () => {
    const newItem = {
      text: "",
      color: "#000000",
      backgroundColor: "#ffffff",
      fontSize: 16,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    handleConfigChange({ target: { name: "items", value: updatedItems } });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updatedItems);
    // Debounce or batch the config update to prevent excessive re-renders
    requestAnimationFrame(() => {
      handleConfigChange({ target: { name: "items", value: updatedItems } });
    });
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    handleConfigChange({ target: { name: "items", value: updatedItems } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleConfigChange({ target: { name, value: value || "" } });
  };

  return (
    <div className="list-config">
      <h3>List Configuration</h3>
      <div className="list-items">
        {items.map((item, index) => (
          <div key={index} className="list-item-config" style={{ marginBottom: "15px" }}>
            <input
              type="text"
              placeholder={`Item ${index + 1}`}
              value={item.text}
              onChange={(e) => updateItem(index, "text", e.target.value)}
              style={{ marginRight: "10px", width: "200px" }}
            />
            <label>
              Color:
              <input
                type="color"
                value={item.color}
                onChange={(e) => updateItem(index, "color", e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              BG Color:
              <input
                type="color"
                value={item.backgroundColor}
                onChange={(e) => updateItem(index, "backgroundColor", e.target.value)}
              />
            </label>
            <label style={{ marginLeft: "10px" }}>
              Size:
              <input
                type="number"
                min="1"
                value={item.fontSize}
                onChange={(e) => updateItem(index, "fontSize", parseInt(e.target.value) || 16)}
                style={{ width: "60px" }}
              />
            </label>
            <button
              onClick={() => removeItem(index)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={addItem} style={{ marginBottom: "15px" }}>
        Add List Item
      </button>
      <label>
        List Width:
        <input
          type="number"
          name="width"
          value={config.width || ""}
          onChange={handleInputChange}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <label style={{ marginLeft: "15px" }}>
        List Height:
        <input
          type="number"
          name="height"
          value={config.height || ""}
          onChange={handleInputChange}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, "list")}
        style={{ display: "block", marginTop: "15px" }}
      >
        Drag List
      </button>
    </div>
  );
};

ListConfig.propTypes = {
  config: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        color: PropTypes.string,
        backgroundColor: PropTypes.string,
        fontSize: PropTypes.number,
      })
    ),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
};

ListConfig.defaultProps = {
  config: {
    items: [],
  },
};

export default ListConfig;