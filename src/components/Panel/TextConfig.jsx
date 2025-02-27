import React from "react";

const TextConfig = ({ config, setConfig, handleDragStart, isEditingExisting }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
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
      <label>
        Font Size:
        <input
          type="number"
          name="fontSize"
          value={config.fontSize || "16"}
          onChange={handleChange}
          min="8"
          max="72"
          step="1"
        />
      </label>
      <label>
        Font Weight:
        <select
          name="fontWeight"
          value={config.fontWeight || "normal"}
          onChange={handleChange}
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="bolder">Bolder</option>
          <option value="lighter">Lighter</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </select>
      </label>
      {!isEditingExisting && (
        <button draggable onDragStart={(e) => handleDragStart(e, "text")}>
          Drag Text to Canvas
        </button>
      )}
    </div>
  );
};

export default TextConfig;