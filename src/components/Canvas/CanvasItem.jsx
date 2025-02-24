import React, { useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const CanvasItem = ({ element, removeElement, handleResizeMouseDown }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(element.config.content || "");
  const inputRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });

  // Ensure position is applied as base, with transform for dragging
  const style = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: element.size ? `${element.size.width}px` : "auto",
    height: element.size ? `${element.size.height}px` : "auto",
    transform: transform ? CSS.Translate.toString(transform) : "none", // Reset transform when not dragging
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = () => {
    setIsEditing(false);
    element.config.content = editedContent; // Direct mutation (assuming intentional)
  };

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  return (
    <div
      ref={setNodeRef}
      className="canvas-item"
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
    >
      <button className="remove-button" onClick={() => removeElement(element.id)}>
        ×
      </button>
      {element.type === "text" && (
        <>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedContent}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              style={{
                fontSize: `${element.config.size}px`,
                color: element.config.color || "#000",
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          ) : (
            <h2 style={{ fontSize: `${element.config.size}px`, color: element.config.color || "#000" }}>
              {editedContent || "Headline"}
            </h2>
          )}
        </>
      )}
      {element.type === "image" && (
        <img
          src={element.config.imageUrl || "https://via.placeholder.com/150"}
          alt="Placeholder"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {element.type === "list" && (
        <>
          {isEditing ? (
            <textarea
              ref={inputRef}
              value={editedContent}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              style={{
                color: element.config.color || "#000",
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                resize: "none",
              }}
            />
          ) : (
            <ul style={{ color: element.config.color || "#000" }}>
              {editedContent.split(",").map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {element.type !== "text" && element.type !== "list" && (
        <div
          className="resize-handle"
          onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
        ></div>
      )}
    </div>
  );
};

export default CanvasItem;