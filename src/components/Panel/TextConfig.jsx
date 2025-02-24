import React from "react";

const TextConfig = ({ config, handleConfigChange, handleDragStart }) => {
  return (
    <div>
      <label>
        Headline Font Size (px):
        <input
          type="number"
          name="size"
          value={config.size || ""}
          onChange={handleConfigChange}
          min="1"
        />
      </label>
      <label>
        Headline Content:
        <input
          type="text"
          name="content"
          value={config.content || ""}
          onChange={handleConfigChange}
        />
      </label>
      <label>
        Headline Color:
        <input
          type="color"
          name="color"
          value={config.color || "#000000"}
          onChange={handleConfigChange}
        />
      </label>
      <button
        draggable
        onDragStart={(e) => handleDragStart(e, "text")}
      >
        Drag Headline
      </button>
    </div>
  );
};

export default TextConfig;