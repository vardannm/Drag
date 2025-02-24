import React from "react";

const ImageConfig = ({ config, handleConfigChange, handleFileChange, handleDragStart }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleConfigChange({ target: { name, value: value || "" } }); // Ensure value is always defined
  };

  return (
    <div>
      <label>
        Upload Image:
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>
      <label>
        Width:
        <input
          type="number"
          name="width"
          value={config.width || ""}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          name="height"
          value={config.height || ""}
          onChange={handleInputChange}
        />
      </label>
      <button draggable onDragStart={(e) => handleDragStart(e, "image")}>
        Drag Image
      </button>
    </div>
  );
};

export default ImageConfig;