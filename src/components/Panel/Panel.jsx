import PropTypes from "prop-types";
import TextConfig from "./TextConfig";
import ImageConfig from "./ImageConfig";
import ListConfig from "./ListConfig";

const Panel = ({
  selectedType,
  config,
  handleConfigChange,
  handleFileChange,
  handleDragStart,
  setSelectedType,
  handleBackgroundColorChange,
  elements,
  removeElement,
}) => {
  return (
    <div className="panel">
      <div>
        <button onClick={() => setSelectedType("text")}>Configure Headline</button>
        <button onClick={() => setSelectedType("image")}>Configure Image</button>
        <button onClick={() => setSelectedType("list")}>Configure List</button>
      </div>
      {selectedType === "text" && (
        <TextConfig
          config={config}
          handleConfigChange={handleConfigChange}
          handleDragStart={handleDragStart}
        />
      )}
      {selectedType === "image" && (
        <ImageConfig
          config={config}
          handleConfigChange={handleConfigChange}
          handleFileChange={handleFileChange}
          handleDragStart={handleDragStart}
        />
      )}
      {selectedType === "list" && (
        <ListConfig
          config={config}
          handleConfigChange={handleConfigChange}
          handleDragStart={handleDragStart}
        />
      )}
      <div>
        <label>
          Canvas Background Color:
          <input
            type="color"
            value={config.canvasBackgroundColor || "#ffffff"}
            onChange={handleBackgroundColorChange}
            name="canvasBackgroundColor"
          />
        </label>
      </div>
      <div className="elements-list">
        <h3>Elements on Canvas</h3>
        {elements && elements.map((el) => (
          <div key={el.id} className="element-item">
            <span>
              {el.type === "text" && `Headline: ${el.config.content}`}
              {el.type === "image" && `Image: ${el.config.imageUrl.split('/').pop()}`}
              {el.type === "list" && `List: ${el.config.items?.map(item => item.text).join(", ") || ""}`}
            </span>
            <button onClick={() => removeElement(el.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

Panel.propTypes = {
  selectedType: PropTypes.oneOf(["text", "image", "list", null]),
  config: PropTypes.shape({
    canvasBackgroundColor: PropTypes.string,
    content: PropTypes.string,
    imageUrl: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        color: PropTypes.string,
        backgroundColor: PropTypes.string,
        fontSize: PropTypes.number,
      })
    ),
  }).isRequired,
  handleConfigChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func,
  handleDragStart: PropTypes.func.isRequired,
  setSelectedType: PropTypes.func.isRequired,
  handleBackgroundColorChange: PropTypes.func.isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["text", "image", "list"]).isRequired,
      config: PropTypes.object.isRequired,
    })
  ),
  removeElement: PropTypes.func.isRequired,
};

Panel.defaultProps = {
  selectedType: null,
  elements: [],
  handleFileChange: () => {},
};

export default Panel;