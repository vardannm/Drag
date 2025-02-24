import PropTypes from "prop-types";

const AlignmentLine = ({ alignmentLine }) => {
  return (
    <div
      className="alignment-line"
      style={{
        position: "absolute",
        left: alignmentLine.type === "vertical" ? alignmentLine.position : 0,
        top: alignmentLine.type === "horizontal" ? alignmentLine.position : 0,
        width: alignmentLine.type === "vertical" ? 1 : "100%",
        height: alignmentLine.type === "horizontal" ? 1 : "100%",
        backgroundColor: "blue",
        pointerEvents: "none",
      }}
    />
  );
};

AlignmentLine.propTypes = {
  alignmentLine: PropTypes.shape({
    type: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
    position: PropTypes.number.isRequired,
  }).isRequired,
};

export default AlignmentLine;