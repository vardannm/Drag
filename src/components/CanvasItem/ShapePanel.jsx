import React from 'react';

const shapes = [
  { type: 'rect', label: 'Rectangle' },
  { type: 'circle', label: 'Circle' },
  { type: 'triangle', label: 'Triangle' },
  { type: 'text', label: 'Text' },
  { type: 'line', label: 'Line' },
  { type: 'image', label: 'Image' },
];

export default function ShapePanel({ onDragStart, onUploadImage }) {
  return (
    <div style={{ padding: 10, borderRight: '1px solid #ccc', width: 180 }}>
      <h3>Shapes</h3>
      {shapes.map(shape => (
        <div
          key={shape.type}
          draggable
          onDragStart={e => onDragStart(e, shape.type)}
          style={{
            padding: 8,
            margin: '10px 0',
            border: '1px solid #999',
            cursor: 'grab',
            textAlign: 'center',
            userSelect: 'none',
            backgroundColor: '#f0f0f0',
          }}
        >
          {shape.label}
        </div>
      ))}

      <hr />

      <label
        htmlFor="upload-image"
        style={{
          display: 'block',
          padding: '8px',
          border: '1px solid #999',
          backgroundColor: '#eee',
          cursor: 'pointer',
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        Upload Image
      </label>
      <input
        type="file"
        id="upload-image"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onUploadImage}
      />
    </div>
  );
}
