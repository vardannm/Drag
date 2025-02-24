import React, { useState } from "react";
import { DndContext, useDroppable } from "@dnd-kit/core";
import CanvasItem from "../CanvasItem/CanvasItem";
import AlignmentLine from "../Panel/AligmentLine";
import "./Canvas.css";

const Canvas = ({
  elements,
  setElements,
  removeElement,
  removeAllElements,
  updateElement,
  canvasBackgroundColor,
  viewMode,
}) => {
  const [alignmentLines, setAlignmentLines] = useState([]);
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  const handleDragMove = (event) => {
    const { active, delta } = event;
    const snapThreshold = 10;
    const draggingElement = elements.find((el) => el.id === active.id);
    if (!draggingElement) {
      setAlignmentLines([]);
      return;
    }

    const newX = draggingElement.position.x + delta.x;
    const newY = draggingElement.position.y + delta.y;
    const lines = [];

    elements.forEach((el) => {
      if (el.id !== active.id) {
        if (Math.abs(newY - el.position.y) < snapThreshold) {
          lines.push({ type: "horizontal", position: el.position.y });
        }
        if (Math.abs(newX - el.position.x) < snapThreshold) {
          lines.push({ type: "vertical", position: el.position.x });
        }
      }
    });

    setAlignmentLines(lines);
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const snapThreshold = 10;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id === active.id) {
          let newX = el.position.x + delta.x;
          let newY = el.position.y + delta.y;

          prev.forEach((otherEl) => {
            if (otherEl.id !== active.id) {
              if (Math.abs(newY - otherEl.position.y) < snapThreshold) {
                newY = otherEl.position.y;
              }
              if (Math.abs(newX - otherEl.position.x) < snapThreshold) {
                newX = otherEl.position.x;
              }
            }
          });

          return { ...el, position: { x: newX, y: newY } };
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
    const newElement = {
      id: Date.now(),
      type,
      config,
      position: { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY },
      size: type === "text" || type === "list" ? null : { width: 200, height: 200 },
    };
    setElements((prev) => [...prev, newElement]);
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
        {alignmentLines
          .filter((line) => line && line.type && line.position !== undefined)
          .map((line, index) => (
            <AlignmentLine key={index} type={line.type} position={line.position} />
          ))}
        {elements.map((el) => (
          <CanvasItem
            key={el.id}
            element={el}
            removeElement={removeElement}
            updateElement={updateElement}
            viewMode={viewMode} // Pass viewMode to CanvasItem
          />
        ))}
        {elements.length > 0 && !viewMode && ( // Hide in view mode
          <button className="remove-all-button" onClick={removeAllElements}>
            Remove Everything
          </button>
        )}
      </div>
    </DndContext>
  );
};

export default Canvas;