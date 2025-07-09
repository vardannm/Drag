import React, { useState, useRef, useEffect } from 'react';
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Group ,
  RegularPolygon,
  Transformer,
  Text as KonvaText,
  Line as KonvaLine,
  Image as KonvaImage,
} from 'react-konva';
import ShapePanel from './ShapePanel';
import { ChromePicker } from 'react-color';
import './CanvasEditor.css'
// Helper hook to load images
const useImage = (url) => {
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    if (!url) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    const handleLoad = () => setImage(img);
    img.onload = handleLoad;

    return () => {
      img.onload = null;
    };
  }, [url]);

  return image;
};


export default function CanvasEditor() {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [history, setHistory] = useState([]);
const [historyStep, setHistoryStep] = useState(-1);
const [selectedIds, setSelectedIds] = useState([]);
const [showGrid, setShowGrid] = useState(true);
const [canvasBg, setCanvasBg] = useState('#ffffff');
const [canvasWidth, setCanvasWidth] = useState(900);
const [canvasHeight, setCanvasHeight] = useState(600);
  const stageRef = useRef();
  const trRef = useRef();
const pushToHistory = (newShapes) => {
  const updatedHistory = history.slice(0, historyStep + 1);
  updatedHistory.push(newShapes);
  setHistory(updatedHistory);
  setHistory(updatedHistory);
setHistoryStep(updatedHistory.length - 1);
setTimeout(() => setShapes(newShapes), 0);
};
const GRID_SIZE = 20;
  // For demo, default image URL when you drop 'image'
  const defaultImageUrl =
    'https://konvajs.org/assets/lion.png';

  function handleDragStart(e, type) {
    e.dataTransfer.setData('shapeType', type);
  }
const adjustCanvasSize = (newWidth, newHeight) => {
    const minWidth = 300; // Minimum canvas width
    const minHeight = 200; // Minimum canvas height
    const boundedWidth = Math.max(minWidth, newWidth);
    const boundedHeight = Math.max(minHeight, newHeight);

    // Adjust shapes to stay within new bounds
    const updatedShapes = shapes.map(shape => {
      const shapeWidth = shape.width || shape.radius * 2 || 100;
      const shapeHeight = shape.height || shape.radius * 2 || 100;
      const newX = Math.min(shape.x, boundedWidth - shapeWidth);
      const newY = Math.min(shape.y, boundedHeight - shapeHeight);
      return {
        ...shape,
        x: Math.max(0, newX),
        y: Math.max(0, newY),
      };
    });

    setCanvasWidth(boundedWidth);
    setCanvasHeight(boundedHeight);
    pushToHistory(updatedShapes);
  };
function handleDrop(e) {
  e.preventDefault();
  const stage = stageRef.current.getStage();
  const pointerPosition = stage.getPointerPosition();
  const type = e.dataTransfer.getData('shapeType');

  const id = `shape_${shapes.length + 1}`;

  const baseShape = {
    id,
    type,
    x: pointerPosition.x,
    y: pointerPosition.y,
    fill: 'lightblue',
    stroke: 'black',
    strokeWidth: 2,
    rotation: 0,
    width: 100,
    height: 100,
    radius: 50,
    text: 'Edit me',
    fontSize: 24,
    points: [0, 0, 100, 0],
    imageUrl: defaultImageUrl,
    imageObject: null,
  };

  pushToHistory([...shapes, baseShape]);
  setSelectedId(id);
}


  // Attach transformer to selected shape


  // Update shape props
  const updateShape = (id, newAttrs) => {
    setShapes(shapes.map(shape => (shape.id === id ? { ...shape, ...newAttrs } : shape)));
  };
  useEffect(() => {
    if (selectedId) {
      const stage = stageRef.current.getStage();
      const selectedNode = stage.findOne(`#${selectedId}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else {
      trRef.current.nodes([]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, shapes]);
  // Load image objects for image shapes
useEffect(() => {
  shapes.forEach(shape => {
    if (shape.type === 'image' && !shape.imageObject && shape.imageUrl) {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = shape.imageUrl;
      img.onload = () => {
        updateShape(shape.id, { imageObject: img });
      };
    }
  });
}, [shapes]);


  const renderShape = shape => {
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      rotation: shape.rotation,
      draggable: true,
      onClick: (e) => handleSelectShape(shape.id , e.evt),
      onTap: (e) => handleSelectShape(shape.id , e.evt),
      onDragEnd: e => {
  const snappedX = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
  const snappedY = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;
  updateShape(shape.id, { x: snappedX, y: snappedY });
},

      onTransformEnd: e => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        if (shape.type === 'rect' || shape.type === 'triangle') {
          updateShape(shape.id, {
            x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,

            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        } else if (shape.type === 'circle') {
          updateShape(shape.id, {
            x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,

            rotation: node.rotation(),
            radius: Math.max(5, shape.radius * scaleX),
          });
        } else if (shape.type === 'text') {
          updateShape(shape.id, {
            x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,

            rotation: node.rotation(),
            fontSize: Math.max(5, shape.fontSize * scaleX),
          });
        } else if (shape.type === 'line') {
          // For line, update scale by adjusting points length accordingly
          const newPoints = shape.points.map((p, i) =>
            i % 2 === 0 ? p * scaleX : p * scaleY
          );
          updateShape(shape.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            points: newPoints,
          });
        } else if (shape.type === 'image') {
          updateShape(shape.id, {
            x: Math.round(node.x() / GRID_SIZE) * GRID_SIZE,
y: Math.round(node.y() / GRID_SIZE) * GRID_SIZE,

            rotation: node.rotation(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }
      },
    };

    switch (shape.type) {
      case 'rect':
        return <Rect {...commonProps} width={shape.width} height={shape.height} />;
      case 'circle':
        return <Circle {...commonProps} radius={shape.radius} />;
      case 'triangle':
        return (
          <RegularPolygon
            {...commonProps}
            sides={3}
            radius={Math.max(shape.width, shape.height) / 2}
          />
        );
      case 'text':
        return (
          <KonvaText
            {...commonProps}
            text={shape.text}
            fontSize={shape.fontSize}
            onDblClick={e => {
              // Inline text edit logic (same as before)
              const absPos = e.target.getAbsolutePosition();
              const stageBox = stageRef.current.container().getBoundingClientRect();

              const areaPosition = {
                x: stageBox.left + absPos.x,
                y: stageBox.top + absPos.y,
              };

              const textarea = document.createElement('textarea');
              document.body.appendChild(textarea);

              textarea.value = shape.text;
              textarea.style.position = 'absolute';
              textarea.style.top = `${areaPosition.y}px`;
textarea.style.left = `${areaPosition.x}px`;
textarea.style.width = `${e.target.width()}px`;
textarea.style.height = `${e.target.height()}px`;
textarea.style.fontSize = `${shape.fontSize}px`;
              textarea.style.border = 'none';
              textarea.style.padding = '0px';
              textarea.style.margin = '0px';
              textarea.style.overflow = 'hidden';
              textarea.style.background = 'none';
              textarea.style.outline = 'none';
              textarea.style.resize = 'none';
              textarea.style.lineHeight = e.target.lineHeight();
              textarea.style.fontFamily = e.target.fontFamily();
              textarea.style.transformOrigin = 'left top';
              textarea.style.textAlign = e.target.align();
              textarea.style.color = e.target.fill();
              textarea.focus();

              const removeTextarea = () => {
                updateShape(shape.id, { text: textarea.value });
                document.body.removeChild(textarea);
                window.removeEventListener('click', handleOutsideClick);
              };

              const handleOutsideClick = e => {
                if (e.target !== textarea) {
                  removeTextarea();
                }
              };

              textarea.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                  removeTextarea();
                }
              });

              window.addEventListener('click', handleOutsideClick);
            }}
          />
        );
      case 'line':
        return <KonvaLine {...commonProps} points={shape.points} />;
      case 'image':
        return (
          shape.imageObject && (
            <KonvaImage
              {...commonProps}
              image={shape.imageObject}
              width={shape.width}
              height={shape.height}
            />
          )
        );
        case 'group':
  return (
    <Group
      {...commonProps}
      draggable
      onClick={() => setSelectedId(shape.id)}
    >
      {shape.children.map(child => renderShape(child))}
    </Group>
  );

      default:
        return null;
    }
  };

  const selectedShape = shapes.find(s => s.id === selectedId);
const handleUploadImage = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataURL = reader.result;

    const id = `shape_${shapes.length + 1}`;
    const newShape = {
      id,
      type: 'image',
      x: 50,
      y: 50,
      rotation: 0,
      width: 150,
      height: 150,
      imageUrl: dataURL,
      imageObject: null,
    };

    pushToHistory([...shapes, newShape]);
    setSelectedId(id);
  };

  reader.readAsDataURL(file);
  e.target.value = null;
};

  const undo = () => {
  if (historyStep > 0) {
    setHistoryStep(historyStep - 1);
    setShapes(history[historyStep - 1]);
  }
};

const redo = () => {
  if (historyStep < history.length - 1) {
    setHistoryStep(historyStep + 1);
    setShapes(history[historyStep + 1]);
  }
};
const exportToPng = () => {
  const uri = stageRef.current.getStage().toDataURL({ pixelRatio: 3 });
  const link = document.createElement('a');
  link.download = 'canvas-export.png';
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const handleSelectShape = (id, e) => {
  if (e.shiftKey || e.ctrlKey || e.metaKey) {
    // Multi-select toggle
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  } else {
    setSelectedIds([id]);
  }
};
useEffect(() => {
  const stage = stageRef.current.getStage();
  const nodes = selectedIds.map(id => stage.findOne(`#${id}`)).filter(n => n);
  trRef.current.nodes(nodes);
  trRef.current.getLayer().batchDraw();
}, [selectedIds, shapes]);
const alignShapes = (direction) => {
  const selectedShapes = shapes.filter(s => selectedIds.includes(s.id));
  if (selectedShapes.length < 2) return;

  const updates = [...shapes];

  if (direction === 'left') {
    const minX = Math.min(...selectedShapes.map(s => s.x));
    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      updates[index] = { ...updates[index], x: minX };
    });
  }

  if (direction === 'right') {
    const maxX = Math.max(...selectedShapes.map(s => s.x + (s.width || 0)));
    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      const w = updates[index].width || 0;
      updates[index] = { ...updates[index], x: maxX - w };
    });
  }

  if (direction === 'top') {
    const minY = Math.min(...selectedShapes.map(s => s.y));
    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      updates[index] = { ...updates[index], y: minY };
    });
  }

  if (direction === 'bottom') {
    const maxY = Math.max(...selectedShapes.map(s => s.y + (s.height || 0)));
    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      const h = updates[index].height || 0;
      updates[index] = { ...updates[index], y: maxY - h };
    });
  }

  if (direction === 'centerX') {
    const avgX =
      selectedShapes.reduce((acc, s) => acc + s.x + (s.width || 0) / 2, 0) /
      selectedShapes.length;

    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      const w = updates[index].width || 0;
      updates[index] = { ...updates[index], x: avgX - w / 2 };
    });
  }

  if (direction === 'centerY') {
    const avgY =
      selectedShapes.reduce((acc, s) => acc + s.y + (s.height || 0) / 2, 0) /
      selectedShapes.length;

    selectedShapes.forEach(s => {
      const index = updates.findIndex(x => x.id === s.id);
      const h = updates[index].height || 0;
      updates[index] = { ...updates[index], y: avgY - h / 2 };
    });
  }

  pushToHistory(updates);
};
const renderGridLines = () => {
  const lines = [];

  // Vertical lines
  for (let i = GRID_SIZE; i < canvasWidth; i += GRID_SIZE) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, 0, i, canvasHeight]}
        stroke="#ddd"
        strokeWidth={1}
        listening={false}
      />
    );
  }

  // Horizontal lines
  for (let j = GRID_SIZE; j < canvasHeight; j += GRID_SIZE) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, j, canvasWidth, j]}
        stroke="#ddd"
        strokeWidth={1}
        listening={false}
      />
    );
  }

  return lines;
};
const groupShapes = () => {
  if (selectedIds.length < 2) return;

  const groupId = `group_${Date.now()}`;
  const grouped = shapes.filter(s => selectedIds.includes(s.id));

  const groupShape = {
    id: groupId,
    type: 'group',
    children: grouped,
    x: 0,
    y: 0,
  };

  const remaining = shapes.filter(s => !selectedIds.includes(s.id));
  pushToHistory([...remaining, groupShape]);
  setSelectedIds([groupId]);
};
const ungroupShape = () => {
  const shape = shapes.find(s => s.id === selectedId);
  if (!shape || shape.type !== 'group') return;

  const others = shapes.filter(s => s.id !== shape.id);
  pushToHistory([...others, ...shape.children]);
  setSelectedIds(shape.children.map(c => c.id));
};
const bringToFront = () => {
  const ids = new Set(selectedIds);
  const reordered = [
    ...shapes.filter(s => !ids.has(s.id)),
    ...shapes.filter(s => ids.has(s.id)),
  ];
  pushToHistory(reordered);
};

const sendToBack = () => {
  const ids = new Set(selectedIds);
  const reordered = [
    ...shapes.filter(s => ids.has(s.id)),
    ...shapes.filter(s => !ids.has(s.id)),
  ];
  pushToHistory(reordered);
};
const saveCanvas = () => {
  const json = JSON.stringify(shapes);
  localStorage.setItem('canvas-data', json);
  alert('Canvas saved!');
};
const loadCanvas = () => {
  const json = localStorage.getItem('canvas-data');
  if (!json) return;
  const loaded = JSON.parse(json);
  pushToHistory(loaded);
  setSelectedIds([]);
};

return (
  <div className="canvas-editor">
    <ShapePanel onDragStart={handleDragStart} onUploadImage={handleUploadImage} />

    {/* Canvas Area */}
    <div
      className="canvas-area"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={canvasBg}
            listening={false}
          />
          {showGrid && renderGridLines()}
          {shapes.map(shape => renderShape(shape))}
        </Layer>
        <Layer>
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          />
        </Layer>
      </Stage>
    </div>

    {/* Right Panel */}
    <div className="right-panel">
      {/* Top Utility Controls */}
      <div className="button-group">
        <button onClick={undo} disabled={historyStep <= 0}>Undo</button>
        <button onClick={redo} disabled={historyStep >= history.length - 1}>Redo</button>
        <button onClick={exportToPng}>Export PNG</button>
        <button
          onClick={() => {
            const filtered = shapes.filter(s => !selectedIds.includes(s.id));
            pushToHistory(filtered);
            setSelectedIds([]);
          }}
          disabled={selectedIds.length === 0}
        >
          Delete Selected
        </button>
        <button
          onClick={() => {
            pushToHistory([]);
            setSelectedId(null);
            setSelectedIds([]);
          }}
        >
          Delete All
        </button>
      </div>

      {/* Canvas Size */}
      <h3>Canvas Size</h3>
      <div className="button-group">
        <button onClick={() => adjustCanvasSize(canvasWidth + 50, canvasHeight)}>+ Width</button>
        <button onClick={() => adjustCanvasSize(canvasWidth - 50, canvasHeight)}>- Width</button>
        <button onClick={() => adjustCanvasSize(canvasWidth, canvasHeight + 50)}>+ Height</button>
        <button onClick={() => adjustCanvasSize(canvasWidth, canvasHeight - 50)}>- Height</button>
      </div>
      <div>
        <label>Width: {canvasWidth}px</label>
        <input
          type="number"
          min="300"
          value={canvasWidth}
          onChange={(e) => adjustCanvasSize(Number(e.target.value), canvasHeight)}
        />
        <label>Height: {canvasHeight}px</label>
        <input
          type="number"
          min="200"
          value={canvasHeight}
          onChange={(e) => adjustCanvasSize(canvasWidth, Number(e.target.value))}
        />
      </div>

      {/* Shape Properties */}
      {selectedShape ? (
        <>
          <h3>Properties</h3>
          <label>Fill Color</label>
          <ChromePicker
            color={selectedShape.fill}
            onChange={(color) => updateShape(selectedId, { fill: color.hex })}
            disableAlpha
          />
          <label>Stroke Color</label>
          <ChromePicker
            color={selectedShape.stroke}
            onChange={(color) => updateShape(selectedId, { stroke: color.hex })}
            disableAlpha
          />
          <label>Stroke Width</label>
          <input
            type="number"
            min="0"
            max="20"
            value={selectedShape.strokeWidth}
            onChange={(e) =>
              updateShape(selectedId, { strokeWidth: Number(e.target.value) })
            }
          />
          <label>Rotation</label>
          <input
            type="number"
            min="0"
            max="360"
            value={selectedShape.rotation}
            onChange={(e) =>
              updateShape(selectedId, { rotation: Number(e.target.value) })
            }
          />
          {selectedShape.type === 'text' && (
            <>
              <label>Text</label>
              <textarea
                value={selectedShape.text}
                onChange={(e) => updateShape(selectedId, { text: e.target.value })}
              />
              <label>Font Size</label>
              <input
                type="number"
                min="8"
                max="100"
                value={selectedShape.fontSize}
                onChange={(e) =>
                  updateShape(selectedId, { fontSize: Number(e.target.value) })
                }
              />
            </>
          )}
          {selectedShape.type === 'image' && (
            <>
              <label>Image URL</label>
              <input
                type="text"
                value={selectedShape.imageUrl}
                onChange={(e) =>
                  updateShape(selectedId, {
                    imageUrl: e.target.value,
                    imageObject: null,
                  })
                }
              />
            </>
          )}
          {selectedShape.type === 'line' && (
            <>
              <label>Points (comma separated)</label>
              <input
                type="text"
                value={selectedShape.points.join(',')}
                onChange={(e) => {
                  const pts = e.target.value
                    .split(',')
                    .map(Number)
                    .filter((n) => !isNaN(n));
                  if (pts.length % 2 === 0) {
                    updateShape(selectedId, { points: pts });
                  }
                }}
              />
            </>
          )}
        </>
      ) : (
        <p>Select a shape to edit properties</p>
      )}

      {/* Shape List */}
      <h3>Shapes List</h3>
      <ul className="shape-list">
        {shapes.map((shape) => (
          <li
            key={shape.id}
            onClick={() => {
              setSelectedId(shape.id);
              setSelectedIds([shape.id]);
            }}
            className={selectedIds.includes(shape.id) ? 'selected' : ''}
          >
            [{shape.type}] {shape.type === 'text' ? `"${shape.text}"` : shape.id}
          </li>
        ))}
      </ul>

      {/* Canvas Controls */}
      <h3>Canvas</h3>
      <label>Background Color</label>
      <ChromePicker
        color={canvasBg}
        onChange={(color) => setCanvasBg(color.hex)}
        disableAlpha
      />
      <h3>Align</h3>
      <div className="button-group">
        <button onClick={() => alignShapes('left')}>Left</button>
        <button onClick={() => alignShapes('right')}>Right</button>
        <button onClick={() => alignShapes('top')}>Top</button>
        <button onClick={() => alignShapes('bottom')}>Bottom</button>
        <button onClick={() => alignShapes('centerX')}>Center X</button>
        <button onClick={() => alignShapes('centerY')}>Center Y</button>
      </div>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={showGrid}
          onChange={() => setShowGrid(!showGrid)}
        /> Show Grid
      </label>
      <div className="button-group">
        <button onClick={groupShapes}>Group</button>
        <button onClick={ungroupShape}>Ungroup</button>
        <button onClick={bringToFront}>Bring to Front</button>
        <button onClick={sendToBack}>Send to Back</button>
        <button onClick={saveCanvas}>Save</button>
        <button onClick={loadCanvas}>Load</button>
      </div>
    </div>
  </div>
);
}