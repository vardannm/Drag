import React, { useState } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import CanvasItem from "../CanvasItem/CanvasItem";
import AlignmentLine from "../Panel/AligmentLine";
import "./Canvas.css";

const Canvas = ({
  elements,
  setElements,
  addOrDuplicateElement,
  removeElement,
  removeAllElements,
  updateElement,
  canvasBackgroundColor,
  viewMode,
  selectedElementId,
  setSelectedElementId,
}) => {
  const [alignmentLines, setAlignmentLines] = useState([]);
  const { setNodeRef } = useDroppable({ id: "canvas" });

  const handleDragMove = (event) => {
    const { active, delta } = event;
    const snapThreshold = 10; // Reduced for precision; adjustable
    const draggingElement = elements.find((el) => el.id === active.id);
    if (!draggingElement) {
      setAlignmentLines([]);
      return;
    }

    const newX = draggingElement.position.x + delta.x;
    const newY = draggingElement.position.y + delta.y;
    const newRotation = draggingElement.rotation || 0;
    const { width = 100, height = 50 } = draggingElement.config || {}; // Default size if not provided

    const lines = [];
    elements.forEach((el) => {
      if (el.id !== active.id) {
        const { x: otherX, y: otherY } = el.position;
        const { width: otherWidth = 100, height: otherHeight = 50 } = el.config || {};
        const otherRotation = el.rotation || 0;

        // Horizontal alignments (top, center, bottom)
        const draggingTop = newY;
        const draggingCenterY = newY + height / 2;
        const draggingBottom = newY + height;
        const otherTop = otherY;
        const otherCenterY = otherY + otherHeight / 2;
        const otherBottom = otherY + otherHeight;

        if (Math.abs(draggingTop - otherTop) < snapThreshold) {
          lines.push({ type: "horizontal", position: otherTop });
        }
        if (Math.abs(draggingCenterY - otherCenterY) < snapThreshold) {
          lines.push({ type: "horizontal", position: otherCenterY });
        }
        if (Math.abs(draggingBottom - otherBottom) < snapThreshold) {
          lines.push({ type: "horizontal", position: otherBottom });
        }

        // Vertical alignments (left, center, right)
        const draggingLeft = newX;
        const draggingCenterX = newX + width / 2;
        const draggingRight = newX + width;
        const otherLeft = otherX;
        const otherCenterX = otherX + otherWidth / 2;
        const otherRight = otherX + otherWidth;

        if (Math.abs(draggingLeft - otherLeft) < snapThreshold) {
          lines.push({ type: "vertical", position: otherLeft });
        }
        if (Math.abs(draggingCenterX - otherCenterX) < snapThreshold) {
          lines.push({ type: "vertical", position: otherCenterX });
        }
        if (Math.abs(draggingRight - otherRight) < snapThreshold) {
          lines.push({ type: "vertical", position: otherRight });
        }

        // Diagonal (45° or 135°) with tolerance
        const dx = Math.abs(draggingCenterX - otherCenterX);
        const dy = Math.abs(draggingCenterY - otherCenterY);
        if (dx > 0 && dy > 0 && Math.abs(dx - dy) < snapThreshold * 2) {
          lines.push({
            type: "diagonal",
            x: draggingCenterX,
            y: draggingCenterY,
            rotation: dx > dy ? 45 : 135,
          });
        }

        // Rotation snap
        if (Math.abs(newRotation - otherRotation) < 5) {
          lines.push({ type: "rotation", position: otherY, rotation: otherRotation });
        }
      }
    });

    setAlignmentLines(lines.slice(0, 5)); // Limit to 5 lines for performance
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const snapThreshold = 5; // Tighter for final snap

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === active.id) {
          let newX = el.position.x + delta.x;
          let newY = el.position.y + delta.y;
          let newRotation = el.rotation || 0;
          const { width = 100, height = 50 } = el.config || {};

          prev.forEach((otherEl) => {
            if (otherEl.id !== active.id) {
              const { x: otherX, y: otherY } = otherEl.position;
              const { width: otherWidth = 100, height: otherHeight = 50 } = otherEl.config || {};
              const otherRotation = otherEl.rotation || 0;

              // Snap to horizontal
              if (Math.abs(newY - otherY) < snapThreshold) newY = otherY;
              if (Math.abs(newY + height / 2 - (otherY + otherHeight / 2)) < snapThreshold) {
                newY = otherY + otherHeight / 2 - height / 2;
              }
              if (Math.abs(newY + height - (otherY + otherHeight)) < snapThreshold) {
                newY = otherY + otherHeight - height;
              }

              // Snap to vertical
              if (Math.abs(newX - otherX) < snapThreshold) newX = otherX;
              if (Math.abs(newX + width / 2 - (otherX + otherWidth / 2)) < snapThreshold) {
                newX = otherX + otherWidth / 2 - width / 2;
              }
              if (Math.abs(newX + width - (otherX + otherWidth)) < snapThreshold) {
                newX = otherX + otherWidth - width;
              }

              // Snap rotation
              if (Math.abs(newRotation - otherRotation) < 5) newRotation = otherRotation;
            }
          });

          return { ...el, position: { x: newX, y: newY }, rotation: newRotation };
        }
        return el;
      })
    );
    setAlignmentLines([]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("type");
    const config = JSON.parse(event.dataTransfer.getData("config"));
    addOrDuplicateElement(type, config, { isDuplicate: false });
  };

  const duplicateElement = (id) => {
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (elementToDuplicate) {
      addOrDuplicateElement(elementToDuplicate.type, elementToDuplicate.config, {
        isDuplicate: true,
        originalElement: elementToDuplicate,
      });
    }
  };

  return (
    <DndContext onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div
        ref={setNodeRef}
        className="canvas"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ backgroundColor: canvasBackgroundColor }}
      >
        {alignmentLines.map((line, index) => (
          <AlignmentLine
            key={index}
            type={line.type}
            position={line.position}
            x={line.x}
            y={line.y}
            rotation={line.rotation}
          />
        ))}
        {elements.map((el) => (
          <CanvasItem
            key={el.id}
            element={el}
            removeElement={removeElement}
            duplicateElement={duplicateElement}
            updateElement={updateElement}
            viewMode={viewMode}
            selectedElementId={selectedElementId}
            setSelectedElementId={setSelectedElementId}
          />
        ))}
        {elements.length > 0 && !viewMode && (
          <button className="remove-all-button" onClick={removeAllElements}>
            Remove Everything
          </button>
        )}
      </div>
    </DndContext>
  );
};

export default Canvas;