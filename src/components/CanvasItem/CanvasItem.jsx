import React, { useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "./CanvasItem.css";

const CanvasItem = ({ element, removeElement, updateElement, viewMode }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: viewMode,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(
    element.type === "list" ? element.config.items.map((i) => i.text).join(",") : element.config.content || ""
  );
  const inputRef = useRef(null);

  const style = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: element.size ? `${element.size.width}px` : "auto",
    height: element.size ? `${element.size.height}px` : "auto",
    transform: CSS.Translate.toString(transform),
  };

  console.log("CanvasItem render, viewMode:", viewMode); // Debug log

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

  const handleEditClick = (e) => {
    e.stopPropagation();
    console.log("Edit clicked", element.type);
    if (element.type === "text" || element.type === "list") {
      setIsEditing(true);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("Focused input/textarea");
        }
      }, 0);
    }
  };

  const handleBlur = () => {
    console.log("Blur triggered, saving:", editedContent);
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

  const handleChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    console.log("Remove clicked", element.id);
    removeElement(element.id);
  };

  return (
    <div className={`canvas-item-wrapper ${viewMode ? "view-mode" : ""}`} style={style}>
      <div
        ref={setNodeRef}
        className="canvas-item-content"
        {...(isEditing || isResizing || viewMode ? {} : listeners)}
        {...(isEditing || isResizing || viewMode ? {} : attributes)}
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
                color: element.config.color || "#000",
              }}
            />
          ) : (
            <h2 style={{ color: element.config.color || "#000" }}>
              {element.config.content || "Headline"}
            </h2>
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
                color: element.config.color || "#000",
                resize: "none",
              }}
            />
          ) : (
            <ul style={{ color: element.config.color || "#000" }}>
              {element.config.items.map((item, index) => (
                <li key={index}>{item.text}</li>
              ))}
            </ul>
          )
        )}
        {(element.type === "image" || element.type === "list") && !viewMode && (
          <div
            className="resize-handle"
            onMouseDown={handleResizeMouseDown}
          />
        )}
      </div>

      {!viewMode && (
        <div className="button-container">
          <button className="remove-button" onClick={handleRemoveClick}>
            ×
          </button>
          {(element.type === "text" || element.type === "list") && (
            <button className="edit-button" onClick={handleEditClick}>
              ✏️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CanvasItem;