import React, { useState, useRef, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import "./CanvasItem.css";

const CanvasItem = ({
  element,
  removeElement,
  duplicateElement,
  updateElement,
  viewMode,
  selectedElementId,
  setSelectedElementId,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    disabled: viewMode,
  });

  const [isResizing, setIsResizing] = useState({ active: false, handle: null });
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

  const shapeStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: element.config.fillEnabled ? element.config.fill || "#C4C4C4" : "transparent",
    border: element.config.strokeEnabled
      ? `${element.config.strokeWidth || 2}px solid ${element.config.stroke || "#000000"}`
      : "none",
    borderRadius: (element.config.shapeType === "rectangle" || element.config.shapeType === "polygon")
      ? `${element.config.cornerRadius || 0}px`
      : "none",
  };

  const handleSelect = (e) => {
    e.stopPropagation();
    if (!viewMode && !isResizing.active && !isRotating && !isEditing) {
      setSelectedElementId(element.id);
    }
  };

  const handleResizeMouseDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing({ active: true, handle });

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = element.size?.width || 100;
    const startHeight = element.size?.height || 100;
    const startLeft = element.position.x;
    const startTop = element.position.y;

    const handleMouseMove = (moveEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      if (handle === "top-left") {
        newWidth = Math.max(50, startWidth - (moveEvent.clientX - startX));
        newHeight = Math.max(50, startHeight - (moveEvent.clientY - startY));
        newLeft = startLeft + (moveEvent.clientX - startX);
        newTop = startTop + (moveEvent.clientY - startY);
      } else if (handle === "top-right") {
        newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
        newHeight = Math.max(50, startHeight - (moveEvent.clientY - startY));
        newTop = startTop + (moveEvent.clientY - startY);
      } else if (handle === "bottom-left") {
        newWidth = Math.max(50, startWidth - (moveEvent.clientX - startX));
        newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
        newLeft = startLeft + (moveEvent.clientX - startX);
      } else if (handle === "bottom-right") {
        newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
        newHeight = Math.max(50, startHeight + (moveEvent.clientY - startY));
      }

      updateElement(element.id, {
        size: { width: newWidth, height: newHeight },
        position: { x: newLeft, y: newTop },
      });
    };

    const handleMouseUp = () => {
      setIsResizing({ active: false, handle: null });
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
    e.preventDefault();
    console.log("Removing element:", element.id); // Debug log
    removeElement(element.id);
  };

  const handleDuplicateClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    duplicateElement(element.id);
  };

  const textStyle = {
    color: element.config.color || "#000",
    fontSize: `${element.config.fontSize || "16"}px`,
    fontWeight: element.config.fontWeight || "normal",
  };

  const renderPolygonPoints = (sides, width, height) => {
    const radius = Math.min(width, height) / 2;
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
      points.push([
        width / 2 + radius * Math.cos(angle),
        height / 2 + radius * Math.sin(angle),
      ]);
    }
    return points.flat().join(",");
  };

  return (
    <div
      className={`canvas-item-wrapper ${viewMode ? "view-mode" : ""}`}
      style={style}
      onClick={handleSelect}
      ref={setNodeRef}
      {...(isEditing || isResizing.active || isRotating || viewMode ? {} : listeners)}
      {...(isEditing || isResizing.active || isRotating || viewMode ? {} : attributes)}
    >
      <div className="canvas-item-content">
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

        {element.type === "shape" && (
          <>
            {element.config.shapeType === "rectangle" && (
              <div style={shapeStyle} />
            )}
            {element.config.shapeType === "ellipse" && (
              <svg style={{ width: "100%", height: "100%" }}>
                <ellipse
                  cx={element.size?.width / 2}
                  cy={element.size?.height / 2}
                  rx={(element.size?.width || 100) / 2}
                  ry={(element.size?.height || 100) / 2}
                  fill={element.config.fillEnabled ? element.config.fill || "#C4C4C4" : "transparent"}
                  stroke={element.config.strokeEnabled ? element.config.stroke || "#000000" : "none"}
                  strokeWidth={element.config.strokeWidth || 2}
                />
              </svg>
            )}
            {element.config.shapeType === "line" && (
              <svg style={{ width: "100%", height: "100%" }}>
                <line
                  x1="0"
                  y1={element.size?.height / 2 || 0}
                  x2={element.size?.width || 100}
                  y2={element.size?.height / 2 || 0}
                  stroke={element.config.strokeEnabled ? element.config.stroke || "#000000" : "none"}
                  strokeWidth={element.config.strokeWidth || 2}
                />
              </svg>
            )}
            {element.config.shapeType === "polygon" && (
              <svg style={{ width: "100%", height: "100%" }}>
                <polygon
                  points={renderPolygonPoints(
                    element.config.sides || 3,
                    element.size?.width || 100,
                    element.size?.height || 100
                  )}
                  fill={element.config.fillEnabled ? element.config.fill || "#C4C4C4" : "transparent"}
                  stroke={element.config.strokeEnabled ? element.config.stroke || "#000000" : "none"}
                  strokeWidth={element.config.strokeWidth || 2}
                />
              </svg>
            )}
          </>
        )}

        {!viewMode && (element.type === "image" || element.type === "list" || element.type === "shape") && (
          <>
            {(element.config.shapeType === "rectangle" || element.config.shapeType === "polygon") && (
              <>
                <div className="resize-handle top-left" onMouseDown={(e) => handleResizeMouseDown(e, "top-left")} />
                <div className="resize-handle top-right" onMouseDown={(e) => handleResizeMouseDown(e, "top-right")} />
                <div className="resize-handle bottom-left" onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")} />
                <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")} />
              </>
            )}
            {element.type === "image" || (element.type === "shape" && element.config.shapeType !== "rectangle" && element.config.shapeType !== "polygon") && (
              <div className="resize-handle bottom-right" onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")} />
            )}
            <div className="rotate-handle" onMouseDown={handleRotateMouseDown} />
          </>
        )}
      </div>

      {!viewMode && (
        <div className="button-container">
          <button className="remove-button" onClick={handleRemoveClick} aria-label="Remove element">×</button>
          {(element.type === "text" || element.type === "list") && (
            <button className="edit-button" onClick={handleEditClick} aria-label="Edit element">✏️</button>
          )}
          <button className="duplicate-button" onClick={handleDuplicateClick} aria-label="Duplicate element">📋</button>
        </div>
      )}
    </div>
  );
};

export default CanvasItem;