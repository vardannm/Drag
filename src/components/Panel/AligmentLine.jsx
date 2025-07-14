import React from "react";
import "./AligmentLine.css";

const AlignmentLine = ({ type, position, x, y, rotation }) => {
  const style = {
    position: "absolute",
    backgroundColor: "blue",
    pointerEvents: "none",
    zIndex: 9999,
  };

  switch (type) {
    case "horizontal":
      Object.assign(style, {
        top: `${position}px`,
        left: 0,
        width: "100%",
        height: "1px",
      });
      break;
    case "vertical":
      Object.assign(style, {
        left: `${position}px`,
        top: 0,
        height: "100%",
        width: "1px",
      });
      break;
    case "diagonal":
      Object.assign(style, {
        left: `${x}px`,
        top: `${y}px`,
        width: "200%", 
        height: "1px",
        transform: `rotate(${rotation}deg) translate(-50%, -50%)`,
        transformOrigin: "center",
      });
      break;
    case "rotation":
      Object.assign(style, {
        top: `${position}px`,
        left: 0,
        width: "100%",
        height: "1px",
        backgroundColor: "green", 
      });
      break;
    default:
      Object.assign(style, { display: "none" });
      break;
  }

  return <div className="alignment-line" style={style} />;
};

export default AlignmentLine;