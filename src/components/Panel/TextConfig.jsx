import React from "react";

const TextConfig = ({ config, setConfig, handleDragStart }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="config-section">
      <h4>Text Configuration</h4>
      <label>
        Content:
        <input
          type="text"
          name="content"
          value={config.content || ""}
          onChange={handleChange}
          placeholder="Enter text"
        />
      </label>
      <label>
        Color:
        <input
          type="color"
          name="color"
          value={config.color || "#000000"}
          onChange={handleChange}
        />
      </label>
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, "text")}
      >
        Drag Text to Canvas
      </button>
    </div>
  );
};

export default TextConfig;