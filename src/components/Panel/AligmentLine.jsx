import React from "react";
import "./AligmentLine.css";

const AlignmentLine = ({ type, position }) => {
  const style = {
    position: "absolute",
    backgroundColor: "blue",
    pointerEvents: "none",
    zIndex: 9999,
    ...(type === "horizontal" // Line 9: accessing type here
      ? { top: `${position}px`, left: 0, width: "100%", height: "1px" }
      : { left: `${position}px`, top: 0, height: "100%", width: "1px" }),
  };

  return <div className="alignment-line" style={style} />;
};

export default AlignmentLine;