import React, { useState, useRef, useEffect } from 'react';
     import {
       Stage,
       Layer,
       Rect,
       Circle,
       Line,
       Group,
       RegularPolygon,
       Transformer,
       Text as KonvaText,
       Line as KonvaLine,
       Image as KonvaImage,
     } from 'react-konva';
     import ShapePanel from './ShapePanel';
     import { ChromePicker } from 'react-color';
     import './CanvasEditor.css';

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

     export default function CanvasEditor({ templateData, onSaveTemplate }) {
       const [shapes, setShapes] = useState(templateData?.shapes || []);
       const [selectedId, setSelectedId] = useState(null);
       const [history, setHistory] = useState([]);
       const [historyStep, setHistoryStep] = useState(-1);
       const [selectedIds, setSelectedIds] = useState([]);
       const [showGrid, setShowGrid] = useState(false);
       const [canvasBg, setCanvasBg] = useState(templateData?.canvasBg || '#ffffff');
       const [canvasWidth, setCanvasWidth] = useState(templateData?.canvasWidth || 900);
       const [canvasHeight, setCanvasHeight] = useState(templateData?.canvasHeight || 600);
       const [expandedSections, setExpandedSections] = useState({
         canvas: true,
         properties: true,
         align: true,
         shapes: true,
       });
       const [shapeSearch, setShapeSearch] = useState('');
       const stageRef = useRef();
       const trRef = useRef();
       const fileInputRef = useRef(null);
       const mainLayerRef = useRef(null);
       const gridLayerRef = useRef(null);
       const backgroundLayerRef = useRef(null);

       useEffect(() => {
         if (templateData) {
           setShapes(templateData.shapes || []);
           setCanvasWidth(templateData.canvasWidth || 900);
           setCanvasHeight(templateData.canvasHeight || 600);
           setCanvasBg(templateData.canvasBg || '#ffffff');
           pushToHistory(templateData.shapes || []);
         }
       }, [templateData]);

       const pushToHistory = (newShapes) => {
         const updatedHistory = history.slice(0, historyStep + 1);
         updatedHistory.push(newShapes);
         setHistory(updatedHistory);
         setHistoryStep(updatedHistory.length - 1);
         setTimeout(() => setShapes(newShapes), 0);
       };

       const GRID_SIZE = 20;
       const defaultImageUrl = 'https://konvajs.org/assets/lion.png';

       const toggleSection = (section) => {
         setExpandedSections((prev) => ({
           ...prev,
           [section]: !prev[section],
         }));
       };

       function handleDragStart(e, type) {
         e.dataTransfer.setData('shapeType', type);
       }

       const adjustCanvasSize = (newWidth, newHeight) => {
         const minWidth = 300;
         const minHeight = 200;
         const boundedWidth = Math.max(minWidth, newWidth);
         const boundedHeight = Math.max(minHeight, newHeight);
         const updatedShapes = shapes.map((shape) => {
           const shapeWidth = shape.width || shape.radius * 2 || 100;
           const shapeHeight = shape.height || shape.radius * 2 || 100;
           const newX = Math.min(Math.max(0, shape.x), boundedWidth - shapeWidth);
           const newY = Math.min(Math.max(0, shape.y), boundedHeight - shapeHeight);
           return {
             ...shape,
             x: newX,
             y: newY,
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
           x: Math.min(Math.max(0, pointerPosition.x), canvasWidth - 100),
           y: Math.min(Math.max(0, pointerPosition.y), canvasHeight - 100),
           fill: 'lightblue',
           stroke: 'black',
           strokeWidth: 2,
           rotation: 0,
           fontSize: 24,
           fontFamily: 'Arial',
           fontStyle: '',
           align: 'left',
           fontWeight: 'normal',
           textDecoration: '',
         };

         if (type === 'rect' || type === 'triangle') {
           baseShape.width = 100;
           baseShape.height = 100;
         } else if (type === 'circle') {
           baseShape.radius = 50;
         } else if (type === 'text') {
           baseShape.text = 'Edit me';
           baseShape.width = 200;
           baseShape.height = baseShape.fontSize * 1.2;
         } else if (type === 'list') {
           baseShape.text = '• Item 1\n• Item 2\n• Item 3';
           baseShape.width = 200;
           baseShape.height = baseShape.fontSize * 3.6;
         } else if (type === 'line') {
           baseShape.points = [0, 0, 100, 0];
         } else if (type === 'image') {
           baseShape.imageUrl = defaultImageUrl;
           baseShape.imageObject = null;
           baseShape.width = 150;
           baseShape.height = 150;
         }

         pushToHistory([...shapes, baseShape]);
         setSelectedId(id);
       }

       const updateShape = (id, newAttrs) => {
         setShapes(
           shapes.map((shape) =>
             shape.id === id ? { ...shape, ...newAttrs } : shape
           )
         );
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

       useEffect(() => {
         shapes.forEach((shape) => {
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

       const renderShape = (shape) => {
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
           onClick: (e) => handleSelectShape(shape.id, e.evt),
           onTap: (e) => handleSelectShape(shape.id, e.evt),
           onDragEnd: (e) => {
             const node = e.target;
             const shapeWidth = shape.width || shape.radius * 2 || 100;
             const shapeHeight = shape.height || shape.radius * 2 || 100;
             const snappedX = Math.round(node.x() / GRID_SIZE) * GRID_SIZE;
             const snappedY = Math.round(node.y() / GRID_SIZE) * GRID_SIZE;
             const clampedX = Math.min(Math.max(0, snappedX), canvasWidth - shapeWidth);
             const clampedY = Math.min(Math.max(0, snappedY), canvasHeight - shapeHeight);
             updateShape(shape.id, { x: clampedX, y: clampedY });
           },
           onTransformEnd: (e) => {
             const node = e.target;
             const scaleX = node.scaleX();
             const scaleY = node.scaleY();

             node.scaleX(1);
             node.scaleY(1);

             const shapeWidth = shape.width || shape.radius * 2 || 100;
             const shapeHeight = shape.height || shape.radius * 2 || 100;
             const newX = Math.min(Math.max(0, node.x()), canvasWidth - shapeWidth);
             const newY = Math.min(Math.max(0, node.y()), canvasHeight - shapeHeight);

             if (shape.type === 'rect' || shape.type === 'triangle') {
               const newWidth = Math.max(5, node.width() * scaleX);
               const newHeight = Math.max(5, node.height() * scaleY);
               updateShape(shape.id, {
                 x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
                 y: Math.round(newY / GRID_SIZE) * GRID_SIZE,
                 rotation: node.rotation(),
                 width: Math.min(newWidth, canvasWidth - newX),
                 height: Math.min(newHeight, canvasHeight - newY),
               });
             } else if (shape.type === 'circle') {
               const newRadius = Math.max(5, shape.radius * scaleX);
               updateShape(shape.id, {
                 x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
                 y: Math.round(newY / GRID_SIZE) * GRID_SIZE,
                 rotation: node.rotation(),
                 radius: Math.min(newRadius, Math.min(canvasWidth - newX, canvasHeight - newY) / 2),
               });
             } else if (shape.type === 'text' || shape.type === 'list') {
               const newFontSize = Math.max(5, shape.fontSize * scaleX);
               const newWidth = Math.max(5, node.width() * scaleX);
               const newHeight = Math.max(5, node.height() * scaleY);
               updateShape(shape.id, {
                 x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
                 y: Math.round(newY / GRID_SIZE) * GRID_SIZE,
                 rotation: node.rotation(),
                 fontSize: newFontSize,
                 width: Math.min(newWidth, canvasWidth - newX),
                 height: Math.min(newHeight, canvasHeight - newY),
               });
             } else if (shape.type === 'line') {
               const newPoints = shape.points.map((p, i) =>
                 i % 2 === 0 ? Math.min(Math.max(0, p * scaleX), canvasWidth - newX) : Math.min(Math.max(0, p * scaleY), canvasHeight - newY)
               );
               updateShape(shape.id, {
                 x: newX,
                 y: newY,
                 rotation: node.rotation(),
                 points: newPoints,
               });
             } else if (shape.type === 'image') {
               const newWidth = Math.max(5, node.width() * scaleX);
               const newHeight = Math.max(5, node.height() * scaleY);
               updateShape(shape.id, {
                 x: Math.round(newX / GRID_SIZE) * GRID_SIZE,
                 y: Math.round(newY / GRID_SIZE) * GRID_SIZE,
                 rotation: node.rotation(),
                 width: Math.min(newWidth, canvasWidth - newX),
                 height: Math.min(newHeight, canvasHeight - newY),
               });
             }
           },
         };

         switch (shape.type) {
           case 'rect':
             return (
               <Rect {...commonProps} width={shape.width} height={shape.height} scaleX={1} scaleY={1} />
             );
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
           case 'list':
             return (
               <KonvaText
                 {...commonProps}
                 text={shape.text}
                 fontSize={shape.fontSize}
                 fontFamily={shape.fontFamily || 'Arial'}
                 fontStyle={shape.fontStyle || 'normal'}
                 fontWeight={shape.fontWeight || 'normal'}
                 align={shape.align || 'left'}
                 textDecoration={shape.textDecoration || ''}
                 width={shape.width || 200}
                 height={shape.height || shape.fontSize * 1.2}
                 listening={true}
                 onDblClick={(e) => {
                   const absPos = e.target.getAbsolutePosition();
                   const stageBox = stageRef.current
                     .container()
                     .getBoundingClientRect();

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

                   const handleOutsideClick = (e) => {
                     if (e.target !== textarea) {
                       removeTextarea();
                     }
                   };

                   textarea.addEventListener('keydown', (e) => {
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
                 {shape.children.map((child) => renderShape(child))}
               </Group>
             );
           default:
             return null;
         }
       };

       const selectedShape = shapes.find((s) => s.id === selectedId);

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
         const stage = stageRef.current.getStage();
         const transformerLayer = trRef.current.getLayer();
         const wasGridVisible = showGrid;

         if (gridLayerRef.current) {
           gridLayerRef.current.visible(false);
         }
         if (transformerLayer) {
           transformerLayer.visible(false);
         }
         stage.batchDraw();

         const uri = stage.toDataURL({ pixelRatio: 3 });

         if (gridLayerRef.current) {
           gridLayerRef.current.visible(wasGridVisible);
         }
         if (transformerLayer) {
           transformerLayer.visible(true);
         }
         stage.batchDraw();

         const link = document.createElement('a');
         link.download = 'canvas-export.png';
         link.href = uri;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       };

       const handleSelectShape = (id, e) => {
         if (e.shiftKey || e.ctrlKey || e.metaKey) {
           if (selectedIds.includes(id)) {
             setSelectedIds(selectedIds.filter((i) => i !== id));
           } else {
             setSelectedIds([...selectedIds, id]);
           }
         } else {
           setSelectedIds([id]);
           setSelectedId(id);
         }
       };

       const deselectAll = () => {
         setSelectedIds([]);
         setSelectedId(null);
       };

       useEffect(() => {
         const stage = stageRef.current.getStage();
         const nodes = selectedIds
           .map((id) => stage.findOne(`#${id}`))
           .filter((n) => n);
         trRef.current.nodes(nodes);
         trRef.current.getLayer().batchDraw();
       }, [selectedIds, shapes]);

       const alignShapes = (direction) => {
         const selectedShapes = shapes.filter((s) => selectedIds.includes(s.id));
         if (selectedShapes.length < 2) return;

         const updates = [...shapes];

         if (direction === 'left') {
           const minX = Math.min(...selectedShapes.map((s) => s.x));
           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             updates[index] = { ...updates[index], x: minX };
           });
         }

         if (direction === 'right') {
           const maxX = Math.max(...selectedShapes.map((s) => s.x + (s.width || 0)));
           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             const w = updates[index].width || 0;
             updates[index] = { ...updates[index], x: maxX - w };
           });
         }

         if (direction === 'top') {
           const minY = Math.min(...selectedShapes.map((s) => s.y));
           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             updates[index] = { ...updates[index], y: minY };
           });
         }

         if (direction === 'bottom') {
           const maxY = Math.max(
             ...selectedShapes.map((s) => s.y + (s.height || 0))
           );
           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             const h = updates[index].height || 0;
             updates[index] = { ...updates[index], y: maxY - h };
           });
         }

         if (direction === 'centerX') {
           const avgX =
             selectedShapes.reduce((acc, s) => acc + s.x + (s.width || 0) / 2, 0) /
             selectedShapes.length;

           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             const w = updates[index].width || 0;
             updates[index] = { ...updates[index], x: avgX - w / 2 };
           });
         }

         if (direction === 'centerY') {
           const avgY =
             selectedShapes.reduce((acc, s) => acc + s.y + (s.height || 0) / 2, 0) /
             selectedShapes.length;

           selectedShapes.forEach((s) => {
             const index = updates.findIndex((x) => x.id === s.id);
             const h = updates[index].height || 0;
             updates[index] = { ...updates[index], y: avgY - h / 2 };
           });
         }

         pushToHistory(updates);
       };

       const renderGridLines = () => {
         const lines = [];

         for (let i = GRID_SIZE; i < canvasWidth; i += GRID_SIZE) {
           lines.push(
             <Line
               key={`v-${i}`}
               points={[i, 0, i, canvasHeight]}
               stroke='#ddd'
               strokeWidth={1}
               listening={false}
             />
           );
         }

         for (let j = GRID_SIZE; j < canvasHeight; j += GRID_SIZE) {
           lines.push(
             <Line
               key={`h-${j}`}
               points={[0, j, canvasWidth, j]}
               stroke='#ddd'
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
         const grouped = shapes.filter((s) => selectedIds.includes(s.id));

         const groupShape = {
           id: groupId,
           type: 'group',
           children: grouped,
           x: 0,
           y: 0,
         };

         const remaining = shapes.filter((s) => !selectedIds.includes(s.id));
         pushToHistory([...remaining, groupShape]);
         setSelectedIds([groupId]);
       };

       const ungroupShape = () => {
         const shape = shapes.find((s) => s.id === selectedId);
         if (!shape || shape.type !== 'group') return;

         const others = shapes.filter((s) => s.id !== shape.id);
         pushToHistory([...others, ...shape.children]);
         setSelectedIds(shape.children.map((c) => c.id));
       };

       const bringToFront = () => {
         const ids = new Set(selectedIds);
         const reordered = [
           ...shapes.filter((s) => !ids.has(s.id)),
           ...shapes.filter((s) => ids.has(s.id)),
         ];
         pushToHistory(reordered);
       };

       const sendToBack = () => {
         const ids = new Set(selectedIds);
         const reordered = [
           ...shapes.filter((s) => ids.has(s.id)),
           ...shapes.filter((s) => !ids.has(s.id)),
         ];
         pushToHistory(reordered);
       };

       const saveCanvas = () => {
         const canvasData = {
           shapes,
           canvasWidth,
           canvasHeight,
           canvasBg,
         };
         const json = JSON.stringify(canvasData);
         const blob = new Blob([json], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.download = 'canvas-data.json';
         link.href = url;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         URL.revokeObjectURL(url);
         alert('Canvas data downloaded as JSON!');
       };

       const saveTemplate = () => {
         const canvasData = {
           shapes,
           canvasWidth,
           canvasHeight,
           canvasBg,
         };
         onSaveTemplate(canvasData);
       };

       const loadCanvas = () => {
         fileInputRef.current.click();
       };

       const handleFileUpload = (e) => {
         const file = e.target.files[0];
         if (!file) return;

         const reader = new FileReader();
         reader.onload = (event) => {
           try {
             const loadedData = JSON.parse(event.target.result);
             if (loadedData.shapes) {
               const clampedShapes = loadedData.shapes.map((shape) => {
                 const shapeWidth = shape.width || shape.radius * 2 || 100;
                 const shapeHeight = shape.height || shape.radius * 2 || 100;
                 const newX = Math.min(Math.max(0, shape.x), loadedData.canvasWidth - shapeWidth);
                 const newY = Math.min(Math.max(0, shape.y), loadedData.canvasHeight - shapeHeight);
                 return { ...shape, x: newX, y: newY };
               });
               pushToHistory(clampedShapes);
               setCanvasWidth(loadedData.canvasWidth || 900);
               setCanvasHeight(loadedData.canvasHeight || 600);
               setCanvasBg(loadedData.canvasBg || '#ffffff');
               setSelectedIds([]);
               alert('Canvas data loaded successfully!');
             } else {
               alert('Invalid JSON format: No shapes found.');
             }
           } catch (error) {
             alert('Error loading JSON file: ' + error.message);
           }
         };
         reader.readAsText(file);
         e.target.value = null;
       };

       const duplicateSelected = () => {
         if (selectedIds.length === 0) return;

         const newShapes = [...shapes];
         const duplicatedShapes = [];

         selectedIds.forEach((id) => {
           const original = shapes.find((s) => s.id === id);
           if (!original) return;

           const newId = `shape_${Date.now()}_${Math.random()
             .toString(36)
             .substr(2, 9)}`;
           const shapeWidth = original.width || original.radius * 2 || 100;
           const shapeHeight = original.height || original.radius * 2 || 100;
           const duplicated = {
             ...original,
             id: newId,
             x: Math.min(Math.max(0, original.x + 20), canvasWidth - shapeWidth),
             y: Math.min(Math.max(0, original.y + 20), canvasHeight - shapeHeight),
           };

           duplicatedShapes.push(duplicated);
           newShapes.push(duplicated);
         });

         pushToHistory(newShapes);
         setSelectedIds(duplicatedShapes.map((s) => s.id));
       };

       const deleteSelected = () => {
         if (selectedIds.length === 0) return;
         const filtered = shapes.filter((s) => !selectedIds.includes(s.id));
         pushToHistory(filtered);
         setSelectedIds([]);
       };

       useEffect(() => {
         const handleKeyDown = (e) => {
           if (e.key === 'Delete' || e.key === 'Backspace') {
             deleteSelected();
           }
           if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
             e.preventDefault();
             duplicateSelected();
           }
           if (e.key === 'Escape') {
             deselectAll();
           }
         };

         window.addEventListener('keydown', handleKeyDown);
         return () => {
           window.removeEventListener('keydown', handleKeyDown);
         };
       }, [shapes, selectedIds]);

       useEffect(() => {
         const fonts = ['Arial', 'Times New Roman', 'Courier New'];
         fonts.forEach((font) => {
           const div = document.createElement('div');
           div.style.fontFamily = font;
           div.style.position = 'absolute';
           div.style.visibility = 'hidden';
           div.innerHTML = '.';
           document.body.appendChild(div);
           setTimeout(() => document.body.removeChild(div), 100);
         });
       }, []);

       return (
         <div className="canvas-editor">
           <div className="toolbar">
             <button onClick={undo} disabled={historyStep <= 0} title="Undo">
               <i className="fas fa-undo">Undo</i>
             </button>
             <button onClick={redo} disabled={historyStep >= history.length - 1} title="Redo">
               <i className="fas fa-redo">Redo</i>
             </button>
             <button onClick={exportToPng} title="Export as PNG">
               <i className="fas fa-image"></i> Export
             </button>
             <button onClick={saveCanvas} title="Save Canvas">
               <i className="fas fa-save"></i> Save
             </button>
             <button onClick={saveTemplate} title="Save Template">
               <i className="fas fa-save"></i> Save Template
             </button>
             <button onClick={loadCanvas} title="Load Canvas">
               <i className="fas fa-upload"></i> Load
             </button>
             <button onClick={deselectAll} disabled={selectedIds.length === 0} title="Deselect All">
               <i className="fas fa-times"></i> Deselect
             </button>
             <input
               type="file"
               ref={fileInputRef}
               style={{ display: 'none' }}
               accept=".json"
               onChange={handleFileUpload}
             />
           </div>
           <div className="main-content">
             <ShapePanel
               onDragStart={handleDragStart}
               onUploadImage={handleUploadImage}
             />
             <div
               className="canvas-area"
               onDrop={handleDrop}
               onDragOver={(e) => e.preventDefault()}
               onClick={(e) => {
                 const stage = stageRef.current.getStage();
                 const target = stage.getIntersection(stage.getPointerPosition());
                 if (!target || target === stage) {
                   deselectAll();
                 }
               }}
             >
               <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
                 <Layer ref={backgroundLayerRef}>
                   <Rect
                     x={0}
                     y={0}
                     width={canvasWidth}
                     height={canvasHeight}
                     fill={canvasBg}
                     listening={false}
                   />
                 </Layer>
                 <Layer ref={gridLayerRef} visible={showGrid}>
                   {renderGridLines()}
                 </Layer>
                 <Layer ref={mainLayerRef}>
                   {shapes.map((shape) => renderShape(shape))}
                 </Layer>
                 <Layer>
                   <Transformer
                     ref={trRef}
                     rotateEnabled
                     enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                     keepRatio={false}
                   />
                 </Layer>
               </Stage>
             </div>
             <div className="right-panel">
               <div className="accordion">
                 <div className="accordion-header" onClick={() => toggleSection('canvas')}>
                   <h3>Canvas Settings</h3>
                   <i className={`fas fa-chevron-${expandedSections.canvas ? 'up' : 'down'}`}></i>
                 </div>
                 {expandedSections.canvas && (
                   <div className="accordion-content">
                     <label>Background Color</label>
                     <ChromePicker
                       color={canvasBg}
                       onChange={(color) => setCanvasBg(color.hex)}
                     />
                     <label>Width: {canvasWidth}px</label>
                     <input
                       type="number"
                       min="300"
                       value={canvasWidth}
                       onChange={(e) =>
                         adjustCanvasSize(Number(e.target.value), canvasHeight)
                       }
                     />
                     <label>Height: {canvasHeight}px</label>
                     <input
                       type="number"
                       min="200"
                       value={canvasHeight}
                       onChange={(e) =>
                         adjustCanvasSize(canvasWidth, Number(e.target.value))
                       }
                     />
                     <div className="button-grid">
                       <button onClick={() => adjustCanvasSize(canvasWidth + 50, canvasHeight)}>
                         <i className="fas fa-plus"></i> Width
                       </button>
                       <button onClick={() => adjustCanvasSize(canvasWidth - 50, canvasHeight)}>
                         <i className="fas fa-minus"></i> Width
                       </button>
                       <button onClick={() => adjustCanvasSize(canvasWidth, canvasHeight + 50)}>
                         <i className="fas fa-plus"></i> Height
                       </button>
                       <button onClick={() => adjustCanvasSize(canvasWidth, canvasHeight - 50)}>
                         <i className="fas fa-minus"></i> Height
                       </button>
                     </div>
                     <label className="checkbox-label">
                       <input
                         type="checkbox"
                         checked={showGrid}
                         onChange={() => setShowGrid(!showGrid)}
                       />{' '}
                       Show Grid
                     </label>
                   </div>
                 )}
               </div>
               <div className="accordion">
                 <div className="accordion-header" onClick={() => toggleSection('properties')}>
                   <h3>Properties</h3>
                   <i className={`fas fa-chevron-${expandedSections.properties ? 'up' : 'down'}`}></i>
                 </div>
                 {expandedSections.properties && (
                   <div className="accordion-content">
                     {selectedShape ? (
                       <>
                         <label>Fill Color</label>
                         <ChromePicker
                           color={selectedShape.fill}
                           onChange={(color) =>
                             updateShape(selectedId, {
                               fill: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                             })
                           }
                         />
                         <label>Stroke Color</label>
                         <ChromePicker
                           color={selectedShape.stroke}
                           onChange={(color) =>
                             updateShape(selectedId, {
                               stroke: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                             })
                           }
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
                         {(selectedShape.type === 'rect' || selectedShape.type === 'image' || selectedShape.type === 'text' || selectedShape.type === 'list') && (
                           <>
                             <label>Width: {selectedShape.width}px</label>
                             <input
                               type="number"
                               min="5"
                               value={selectedShape.width || 100}
                               onChange={(e) => {
                                 const newWidth = Math.max(5, Number(e.target.value));
                                 const clampedWidth = Math.min(newWidth, canvasWidth - selectedShape.x);
                                 updateShape(selectedId, { width: clampedWidth });
                               }}
                             />
                             <label>Height: {selectedShape.height}px</label>
                             <input
                               type="number"
                               min="5"
                               value={selectedShape.height || 100}
                               onChange={(e) => {
                                 const newHeight = Math.max(5, Number(e.target.value));
                                 const clampedHeight = Math.min(newHeight, canvasHeight - selectedShape.y);
                                 updateShape(selectedId, { height: clampedHeight });
                               }}
                             />
                           </>
                         )}
                         {(selectedShape.type === 'text' || selectedShape.type === 'list') && (
                           <>
                             <label>Text Content</label>
                             <textarea
                               className="textContent"
                               value={selectedShape.text}
                               onChange={(e) =>
                                 updateShape(selectedId, { text: e.target.value })
                               }
                             />
                             <div className="text-control-row">
                               <div className="text-control-group">
                                 <label>Font Family</label>
                                 <select
                                   value={selectedShape.fontFamily || 'Arial'}
                                   onChange={(e) =>
                                     updateShape(selectedId, { fontFamily: e.target.value })
                                   }
                                 >
                                   <option value="Arial">Arial</option>
                                   <option value="Verdana">Verdana</option>
                                   <option value="Helvetica">Helvetica</option>
                                   <option value="Times New Roman">Times New Roman</option>
                                   <option value="Courier New">Courier New</option>
                                   <option value="Georgia">Georgia</option>
                                   <option value="Palatino">Palatino</option>
                                   <option value="Garamond">Garamond</option>
                                   <option value="Comic Sans MS">Comic Sans MS</option>
                                   <option value="Impact">Impact</option>
                                 </select>
                               </div>
                               <div className="text-control-group">
                                 <label>Font Size</label>
                                 <input
                                   type="number"
                                   min="8"
                                   max="100"
                                   value={selectedShape.fontSize}
                                   onChange={(e) =>
                                     updateShape(selectedId, {
                                       fontSize: Number(e.target.value),
                                     })
                                   }
                                 />
                               </div>
                             </div>
                             <div className="text-control-row">
                               <div className="text-control-group">
                                 <label>Font Weight</label>
                                 <select
                                   value={selectedShape.fontWeight || 'normal'}
                                   onChange={(e) =>
                                     updateShape(selectedId, { fontWeight: e.target.value })
                                   }
                                 >
                                   <option value="normal">Normal</option>
                                   <option value="bold">Bold</option>
                                   <option value="100">Thin (100)</option>
                                   <option value="200">Extra Light (200)</option>
                                   <option value="300">Light (300)</option>
                                   <option value="400">Regular (400)</option>
                                   <option value="500">Medium (500)</option>
                                   <option value="600">Semi Bold (600)</option>
                                   <option value="700">Bold (700)</option>
                                   <option value="800">Extra Bold (800)</option>
                                   <option value="900">Black (900)</option>
                                 </select>
                               </div>
                               <div className="text-control-group">
                                 <label>Text Align</label>
                                 <select
                                   value={selectedShape.align || 'left'}
                                   onChange={(e) =>
                                     updateShape(selectedId, { align: e.target.value })
                                   }
                                 >
                                   <option value="left">Left</option>
                                   <option value="center">Center</option>
                                   <option value="right">Right</option>
                                 </select>
                               </div>
                             </div>
                             <div className="font-style-controls">
                               <label>
                                 <input
                                   type="checkbox"
                                   checked={selectedShape.fontStyle?.includes('italic') || false}
                                   onChange={(e) => {
                                     const currentStyles = selectedShape.fontStyle?.split(' ') || [];
                                     const newStyles = e.target.checked
                                       ? [...currentStyles, 'italic']
                                       : currentStyles.filter((style) => style !== 'italic');
                                     updateShape(selectedId, {
                                       fontStyle: newStyles.join(' '),
                                     });
                                   }}
                                 />
                                 Italic
                               </label>
                               <label>
                                 <input
                                   type="checkbox"
                                   checked={selectedShape.textDecoration?.includes('underline') || false}
                                   onChange={(e) => {
                                     const currentDecorations = selectedShape.textDecoration?.split(' ') || [];
                                     const newDecorations = e.target.checked
                                       ? [...currentDecorations, 'underline']
                                       : currentDecorations.filter((dec) => dec !== 'underline');
                                     updateShape(selectedId, {
                                       textDecoration: newDecorations.join(' '),
                                     });
                                   }}
                                 />
                                 Underline
                               </label>
                               <label>
                                 <input
                                   type="checkbox"
                                   checked={selectedShape.textDecoration?.includes('line-through') || false}
                                   onChange={(e) => {
                                     const currentDecorations = selectedShape.textDecoration?.split(' ') || [];
                                     const newDecorations = e.target.checked
                                       ? [...currentDecorations, 'line-through']
                                       : currentDecorations.filter((dec) => dec !== 'line-through');
                                     updateShape(selectedId, {
                                       textDecoration: newDecorations.join(' '),
                                     });
                                   }}
                                 />
                                 Strikethrough
                               </label>
                             </div>
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
                   </div>
                 )}
               </div>
               <div className="accordion">
                 <div className="accordion-header" onClick={() => toggleSection('align')}>
                   <h3>Align Shapes</h3>
                   <i className={`fas fa-chevron-${expandedSections.align ? 'up' : 'down'}`}></i>
                 </div>
                 {expandedSections.align && (
                   <div className="accordion-content">
                     <div className="button-grid">
                       <button onClick={() => alignShapes('left')} title="Align Left">
                         <i className="fas fa-align-left"></i> Left
                       </button>
                       <button onClick={() => alignShapes('right')} title="Align Right">
                         <i className="fas fa-align-right"></i> Right
                       </button>
                       <button onClick={() => alignShapes('top')} title="Align Top">
                         <i className="fas fa-align-up"></i> Top
                       </button>
                       <button onClick={() => alignShapes('bottom')} title="Align Bottom">
                         <i className="fas fa-align-down"></i> Bottom
                       </button>
                       <button onClick={() => alignShapes('centerX')} title="Center Horizontally">
                         <i className="fas fa-align-center"></i> Center X
                       </button>
                       <button onClick={() => alignShapes('centerY')} title="Center Vertically">
                         <i className="fas fa-align-center"></i> Center Y
                       </button>
                     </div>
                     <div className="button-grid">
                       <button onClick={groupShapes} disabled={selectedIds.length < 2} title="Group Shapes">
                         <i className="fas fa-object-group"></i> Group
                       </button>
                       <button onClick={ungroupShape} disabled={!selectedShape || selectedShape.type !== 'group'} title="Ungroup Shapes">
                         <i className="fas fa-object-ungroup"></i> Ungroup
                       </button>
                       <button onClick={bringToFront} disabled={selectedIds.length === 0} title="Bring to Front">
                         <i className="fas fa-layer-group"></i> Front
                       </button>
                       <button onClick={sendToBack} disabled={selectedIds.length === 0} title="Send to Back">
                         <i className="fas fa-layer-group"></i> Back
                       </button>
                       <button
                         onClick={() => {
                           pushToHistory([]);
                           setSelectedId(null);
                           setSelectedIds([]);
                         }}
                         title="Delete All Shapes"
                       >
                         <i className="fas fa-trash"></i> Delete All
                       </button>
                       <button
                         onClick={duplicateSelected}
                         disabled={selectedIds.length === 0}
                         title="Duplicate Selected"
                       >
                         <i className="fas fa-copy"></i> Duplicate
                       </button>
                     </div>
                   </div>
                 )}
               </div>
               <div className="accordion">
                 <div className="accordion-header" onClick={() => toggleSection('shapes')}>
                   <h3>Shapes List</h3>
                   <i className={`fas fa-chevron-${expandedSections.shapes ? 'up' : 'down'}`}></i>
                 </div>
                 {expandedSections.shapes && (
                   <div className="accordion-content">
                     <input
                       type="text"
                       placeholder="Search shapes..."
                       value={shapeSearch}
                       onChange={(e) => setShapeSearch(e.target.value)}
                     />
                     <ul className="shape-list">
                       {shapes
                         .filter((shape) =>
                           shape.type === 'text' || shape.type === 'list'
                             ? shape.text.toLowerCase().includes(shapeSearch.toLowerCase())
                             : shape.id.toLowerCase().includes(shapeSearch.toLowerCase())
                         )
                         .map((shape) => (
                           <li
                             key={shape.id}
                             onClick={() => {
                               setSelectedId(shape.id);
                               setSelectedIds([shape.id]);
                             }}
                             className={selectedIds.includes(shape.id) ? 'selected' : ''}
                           >
                             [{shape.type}]{' '}
                             {(shape.type === 'text' || shape.type === 'list') ? `"${shape.text}"` : shape.id}
                           </li>
                         ))}
                     </ul>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </div>
       );
     }