import PropTypes from "prop-types";
import { DndContext, useDroppable } from "@dnd-kit/core";
import CanvasItem from "./CanvasItem";
import AlignmentLine from "./AlignmentLine";

const Canvas = ({
  elements,
  alignmentLine,
  setElements,
  setAlignmentLine,
  removeElement,
  removeAllElements,
  canvasBackgroundColor,
  handleResizeMouseDown,
}) => {
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  const handleDragMove = (event) => {
    const { active, delta } = event;
    const snapThreshold = 10;
    let alignment = null;

    const draggingElement = elements.find((el) => el.id === active.id);
    if (!draggingElement) return;

    const newX = draggingElement.position.x + delta.x;
    const newY = draggingElement.position.y + delta.y;

    elements.forEach((el) => {
      if (el.id !== active.id) {
        if (Math.abs(newY - el.position.y) < snapThreshold) {
          alignment = { type: "horizontal", position: el.position.y };
        }
        if (Math.abs(newX - el.position.x) < snapThreshold) {
          alignment = { type: "vertical", position: el.position.x };
        }
      }
    });

    setAlignmentLine(alignment);
  };

  const handleDragEnd = (event) => {
    const { active, delta } = event;
    const snapThreshold = 10;

    setElements((prev) => {
      const newElements = prev.map((el) => {
        if (el.id === active.id) {
          let newX = el.position.x + delta.x;
          let newY = el.position.y + delta.y;

          // Apply snapping if within threshold
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
      });
      return [...newElements]; // Ensure a new array reference to trigger re-render
    });
    setAlignmentLine(null); // Reset alignment line
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
      size: type === "text" ? null : { width: config.width || 200, height: config.height || "auto" },
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
        {alignmentLine && <AlignmentLine alignmentLine={alignmentLine} />}
        {elements.map((el) => (
          <CanvasItem
            key={el.id}
            element={el}
            removeElement={removeElement}
            handleResizeMouseDown={handleResizeMouseDown}
          />
        ))}
        {elements.length > 0 && (
          <button className="remove-all-button" onClick={removeAllElements}>
            Remove Everything
          </button>
        )}
      </div>
    </DndContext>
  );
};

Canvas.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["text", "image", "list"]).isRequired,
      position: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }).isRequired,
      size: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
      }),
      config: PropTypes.object.isRequired,
    })
  ).isRequired,
  alignmentLine: PropTypes.shape({
    type: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
    position: PropTypes.number.isRequired,
  }),
  setElements: PropTypes.func.isRequired,
  setAlignmentLine: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired,
  removeAllElements: PropTypes.func.isRequired,
  canvasBackgroundColor: PropTypes.string.isRequired,
  handleResizeMouseDown: PropTypes.func.isRequired,
};

export default Canvas;