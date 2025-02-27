import React, { useState, useRef, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import "./CanvasItem.css";

const CanvasItem = ({
  element,
  removeElement,
  duplicateElement, // New prop
  updateElement,
  viewMode,
  selectedElementId,
  setSelectedElementId,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: viewMode,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    element.type === "list"
      ? element.config.items.map((i) => i.text).join(", ")
      : element.config.content || ""
  );
  const inputRef = useRef(null);

  const isSelected = element.id === selectedElementId;

  const style = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: element.size ? `${element.size.width}px` : "auto",
    height: element.size ? `${element.size.height}px` : "auto",
    transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px) rotate(${element.rotation || 0}deg)`,
    border: isSelected ? "2px solid #007bff" : "none",
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (!viewMode && !isResizing && !isRotating && !isEditing) {
      setSelectedElementId(element.id);
    }
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size?.width || 200;
    const startHeight = element.size?.height || 200;

    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
      updateElement(element.id, { size: { width: newWidth, height: newHeight } });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startRotation = element.rotation || 0;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const angle = startRotation + Math.atan2(dy, dx) * (180 / Math.PI);
      updateElement(element.id, { rotation: angle });
    };

    const handleMouseUp = () => {
      setIsRotating(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (element.type === "text" || element.type === "list") {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element.type === "text") {
      updateElement(element.id, { config: { ...element.config, content: editedContent } });
    } else if (element.type === "list") {
      const updatedItems = editedContent.split(",").map((text) => ({
        text: text.trim(),
        color: element.config.items[0]?.color || "#000000",
      }));
      updateElement(element.id, { config: { ...element.config, items: updatedItems } });
    }
  };

  const handleChange = useCallback((e) => {
    setEditedContent(e.target.value);
  }, []);

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation();
    duplicateElement(element.id);
  };

  const textStyle = {
    color: element.config.color || "#000",
    fontSize: `${element.config.fontSize || "16"}px`,
    fontWeight: element.config.fontWeight || "normal",
  };

  return (
    <div
      className={`canvas-item-wrapper ${viewMode ? "view-mode" : ""}`}
      style={style}
      onClick={handleSelect}
    >
      <div
        ref={setNodeRef}
        className="canvas-item-content"
        {...(isEditing || isResizing || isRotating || viewMode ? {} : listeners)}
        {...(isEditing || isResizing || isRotating || viewMode ? {} : attributes)}
      >
        {element.type === "text" && (
          isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedContent}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              style={{
                width: "100%",
                border: "1px dashed #ccc",
                background: "transparent",
                ...textStyle,
              }}
            />
          ) : (
            <h2 style={textStyle}>{element.config.content || "Headline"}</h2>
          )
        )}

        {element.type === "image" && (
          <img
            src={element.config.imageUrl || "https://via.placeholder.com/150"}
            alt="Element"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {element.type === "list" && (
          isEditing ? (
            <textarea
              ref={inputRef}
              value={editedContent}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              style={{
                width: "100%",
                height: "100%",
                border: "1px dashed #ccc",
                background: "transparent",
                resize: "none",
                ...textStyle,
              }}
            />
          ) : (
            <ul style={textStyle}>
              {element.config.items.map((item, index) => (
                <li key={index} style={{ color: item.color }}>{item.text}</li>
              ))}
            </ul>
          )
        )}

        {!viewMode && (
          <>
            {(element.type === "image" || element.type === "list") && (
              <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
            )}
            <div className="rotate-handle" onMouseDown={handleRotateMouseDown} />
          </>
        )}
      </div>

      {!viewMode && (
        <div className="button-container">
          <button className="remove-button" onClick={handleRemoveClick}>×</button>
          {(element.type === "text" || element.type === "list") && (
            <button className="edit-button" onClick={handleEditClick}>✏️</button>
          )}
          <button className="duplicate-button" onClick={handleDuplicateClick}>📋</button>
        </div>
      )}
    </div>
  );
};

export default CanvasItem;