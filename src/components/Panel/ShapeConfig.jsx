import React, { useState } from "react";

const ShapeConfig = ({ config, setConfig, handleDragStart, isEditingExisting }) => {
  const [localConfig, setLocalConfig] = useState({
    shapeType: config.shapeType || "rectangle",
    fill: config.fill || "#C4C4C4",
    stroke: config.stroke || "#000000",
    strokeWidth: config.strokeWidth || 2,
    width: config.width || 100,
    height: config.height || 100,
    cornerRadius: config.cornerRadius || 0,
    sides: config.sides || 3,
    fillEnabled: config.fillEnabled !== undefined ? config.fillEnabled : true,
    strokeEnabled: config.strokeEnabled !== undefined ? config.strokeEnabled : true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = ["width", "height", "strokeWidth", "cornerRadius", "sides"].includes(name)
      ? parseInt(value) || 0
      : type === "checkbox"
      ? checked
      : value;
    setLocalConfig((prev) => ({ ...prev, [name]: parsedValue }));
    setConfig({ ...localConfig, [name]: parsedValue });
  };

  return (
    <div className="config-section">
      <h4>Shape Configuration</h4>
      <label>
        Shape Type:
        <select name="shapeType" value={localConfig.shapeType} onChange={handleChange}>
          <option value="rectangle">Rectangle</option>
          <option value="ellipse">Ellipse</option>
          <option value="line">Line</option>
          <option value="polygon">Polygon</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          name="fillEnabled"
          checked={localConfig.fillEnabled}
          onChange={handleChange}
        />
        Enable Fill
      </label>
      {localConfig.fillEnabled && (
        <label>
          Fill Color:
          <input
            type="color"
            name="fill"
            value={localConfig.fill}
            onChange={handleChange}
          />
        </label>
      )}
      <label>
        <input
          type="checkbox"
          name="strokeEnabled"
          checked={localConfig.strokeEnabled}
          onChange={handleChange}
        />
        Enable Stroke
      </label>
      {localConfig.strokeEnabled && (
        <label>
          Stroke Color:
          <input
            type="color"
            name="stroke"
            value={localConfig.stroke}
            onChange={handleChange}
          />
        </label>
      )}
      {localConfig.strokeEnabled && (
        <label>
          Stroke Width:
          <input
            type="number"
            name="strokeWidth"
            value={localConfig.strokeWidth}
            onChange={handleChange}
            min="0"
            max="20"
          />
        </label>
      )}
      {(localConfig.shapeType === "rectangle" || localConfig.shapeType === "polygon") && (
        <label>
          Corner Radius:
          <input
            type="number"
            name="cornerRadius"
            value={localConfig.cornerRadius}
            onChange={handleChange}
            min="0"
            max="50"
          />
        </label>
      )}
      {localConfig.shapeType === "polygon" && (
        <label>
          Number of Sides:
          <input
            type="number"
            name="sides"
            value={localConfig.sides}
            onChange={handleChange}
            min="3"
            max="20"
          />
        </label>
      )}
      {(localConfig.shapeType === "rectangle" || localConfig.shapeType === "ellipse") && (
        <>
          <label>
            Width:
            <input
              type="number"
              name="width"
              value={localConfig.width}
              onChange={handleChange}
              min="10"
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              name="height"
              value={localConfig.height}
              onChange={handleChange}
              min="10"
            />
          </label>
        </>
      )}
      {!isEditingExisting && (
        <button
          draggable
          onDragStart={(e) => handleDragStart(e, "shape")}
        >
          Drag Shape to Canvas
        </button>
      )}
    </div>
  );
};

export default ShapeConfig;