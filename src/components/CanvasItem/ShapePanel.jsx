import React from 'react';

const shapes = [
  { type: 'rect', label: 'Rectangle' },
  { type: 'circle', label: 'Circle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'text', label: 'Text' },
  { type: 'line', label: 'Line' },
  { type: 'image', label: 'Image' },
  { type: 'list', label: 'List' },
];

export default function ShapePanel({ onDragStart, onUploadImage }) {
  return (
    <div className="shape-panel">
      <h3>Shapes</h3>
      {shapes.map(shape => (
        <div
          key={shape.type}
          draggable
          onDragStart={e => onDragStart(e, shape.type)}
          className="shape-item"
        >
          {shape.label}
        </div>
      ))}
      <hr />
      <label
        htmlFor="upload-image"
        className="upload-button"
      >
        Upload Image
      </label>
      <input
        type="file"
        id="upload-image"
        accept="image/*"
        className="upload-input"
        onChange={onUploadImage}
      />
    </div>
  );
}