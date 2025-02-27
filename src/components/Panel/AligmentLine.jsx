import React from "react";
import "./AligmentLine.css";

const AlignmentLine = ({ type, position, rotation }) => {
  const style = {
    position: "absolute",
    backgroundColor: "blue",
    pointerEvents: "none",
    zIndex: 9999,
  };

  switch (rotation) {
    case 0:
    case 360:
      Object.assign(style, {
        top: `${position}px`,
        left: 0,
        width: "100%",
        height: "1px",
      });
      break;
    case 90:
    case 270:
      Object.assign(style, {
        left: `${position}px`,
        top: 0,
        height: "100%",
        width: "1px",
      });
      break;
    case 45:
    case 135:
      Object.assign(style, {
        left: "50%",
        top: "50%",
        width: "100%",
        height: "1px",
        transform: `rotate(${rotation}deg) translate(-50%, -50%)`,
        transformOrigin: "center",
      });
      break;
    case 180:
      Object.assign(style, {
        bottom: `${position}px`,
        left: 0,
        width: "100%",
        height: "1px",
      });
      break;
    default:
      Object.assign(style, {
        display: "none", // Hide when an invalid rotation is provided
      });
      break;
  }

  return <div className="alignment-line" style={style} />;
};

export default AlignmentLine;
