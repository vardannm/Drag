import React from "react";

const ImageConfig = ({ config, setConfig, handleDragStart, isEditingExisting }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfig({ ...config, imageUrl: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: parseInt(value) || "" });
  };

  return (
    <div className="config-section">
      <h4>Image Configuration</h4>
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
          onChange={handleChange}
          placeholder="200"
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          name="height"
          value={config.height || ""}
          onChange={handleChange}
          placeholder="200"
        />
      </label>
      {!isEditingExisting && (
        <button draggable onDragStart={(e) => handleDragStart(e, "image")}>
          Drag Image to Canvas
        </button>
      )}
    </div>
  );
};

export default ImageConfig;