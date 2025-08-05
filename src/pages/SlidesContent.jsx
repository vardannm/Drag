import React, { useState, useEffect, useRef } from 'react';
     import { Link, useNavigate } from 'react-router-dom';
     import { Stage, Layer, Rect, Circle, RegularPolygon, Text as KonvaText, Line as KonvaLine, Image as KonvaImage, Group } from 'react-konva';
     import { fetchSlides, createSlide, fetchTemplates } from '../api/api';
     import './SlidesContent.css';

     const useImage = (url) => {
       const [image, setImage] = useState(null);
       useEffect(() => {
         if (!url) return;
         const img = new window.Image();
         img.crossOrigin = 'anonymous';
         img.src = url;
         img.onload = () => setImage(img);
         img.onerror = () => console.error('Image load error:', url);
         return () => {
           img.onload = null;
           img.onerror = null;
         };
       }, [url]);
       return image;
     };

     function SlidesContent() {
       const navigate = useNavigate();
       const [slides, setSlides] = useState([]);
       const [templates, setTemplates] = useState([]);
       const [selectedTemplateIds, setSelectedTemplateIds] = useState([]);
       const [slideName, setSlideName] = useState('');
       const stageRef = useRef(null);
       const thumbnailRefs = useRef({});

       useEffect(() => {
         fetchSlides()
           .then(data => {
             console.log('Fetched slides:', data);
             setSlides(data);
           })
           .catch(err => {
             console.error('Fetch slides error:', err);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });

         fetchTemplates()
           .then(data => {
             console.log('Fetched templates:', data);
             setTemplates(data);
           })
           .catch(err => {
             console.error('Fetch templates error:', err);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       }, [navigate]);

       const renderTemplateThumbnail = (template, index) => {
         const stage = thumbnailRefs.current[template._id]?.getStage();
         if (!stage) return;

         const canvasData = template.data;
         const { shapes, canvasWidth, canvasHeight, canvasBg } = canvasData;

         stage.removeChildren();
         stage.add(new window.Konva.Layer());

         const bgLayer = new window.Konva.Layer();
         bgLayer.add(new window.Konva.Rect({
           x: 0,
           y: 0,
           width: canvasWidth,
           height: canvasHeight,
           fill: canvasBg,
           listening: false
         }));
         stage.add(bgLayer);

         const shapeLayer = new window.Konva.Layer();
         shapes.forEach(shape => {
           const commonProps = {
             x: shape.x,
             y: shape.y,
             fill: shape.fill,
             stroke: shape.stroke,
             strokeWidth: shape.strokeWidth,
             rotation: shape.rotation,
             listening: false
           };

           switch (shape.type) {
             case 'rect':
               shapeLayer.add(new window.Konva.Rect({
                 ...commonProps,
                 width: shape.width,
                 height: shape.height
               }));
               break;
             case 'circle':
               shapeLayer.add(new window.Konva.Circle({
                 ...commonProps,
                 radius: shape.radius
               }));
               break;
             case 'triangle':
               shapeLayer.add(new window.Konva.RegularPolygon({
                 ...commonProps,
                 sides: 3,
                 radius: Math.max(shape.width, shape.height) / 2
               }));
               break;
             case 'text':
             case 'list':
               shapeLayer.add(new window.Konva.Text({
                 ...commonProps,
                 text: shape.text,
                 fontSize: shape.fontSize,
                 fontFamily: shape.fontFamily || 'Arial',
                 fontStyle: shape.fontStyle || 'normal',
                 fontWeight: shape.fontWeight || 'normal',
                 align: shape.align || 'left',
                 textDecoration: shape.textDecoration || '',
                 width: shape.width || 200,
                 height: shape.height || shape.fontSize * 1.2
               }));
               break;
             case 'line':
               shapeLayer.add(new window.Konva.Line({
                 ...commonProps,
                 points: shape.points
               }));
               break;
             case 'image':
               const imageObj = new window.Image();
               imageObj.crossOrigin = 'anonymous';
               imageObj.src = shape.imageUrl;
               imageObj.onload = () => {
                 shapeLayer.add(new window.Konva.Image({
                   ...commonProps,
                   image: imageObj,
                   width: shape.width,
                   height: shape.height
                 }));
                 shapeLayer.batchDraw();
               };
               imageObj.onerror = () => console.error('Image load error:', shape.imageUrl);
               break;
             case 'group':
               const group = new window.Konva.Group({
                 ...commonProps,
                 draggable: false
               });
               shape.children.forEach(child => {
                 switch (child.type) {
                   case 'rect':
                     group.add(new window.Konva.Rect({
                       x: child.x,
                       y: child.y,
                       width: child.width,
                       height: child.height,
                       fill: child.fill,
                       stroke: child.stroke,
                       strokeWidth: child.strokeWidth,
                       rotation: child.rotation,
                       listening: false
                     }));
                     break;
                   case 'circle':
                     group.add(new window.Konva.Circle({
                       x: child.x,
                       y: child.y,
                       radius: child.radius,
                       fill: child.fill,
                       stroke: child.stroke,
                       strokeWidth: child.strokeWidth,
                       rotation: child.rotation,
                       listening: false
                     }));
                     break;
                   case 'triangle':
                     group.add(new window.Konva.RegularPolygon({
                       x: child.x,
                       y: child.y,
                       sides: 3,
                       radius: Math.max(child.width, child.height) / 2,
                       fill: child.fill,
                       stroke: child.stroke,
                       strokeWidth: child.strokeWidth,
                       rotation: child.rotation,
                       listening: false
                     }));
                     break;
                   case 'text':
                   case 'list':
                     group.add(new window.Konva.Text({
                       x: child.x,
                       y: child.y,
                       text: child.text,
                       fontSize: child.fontSize,
                       fontFamily: child.fontFamily || 'Arial',
                       fontStyle: child.fontStyle || 'normal',
                       fontWeight: child.fontWeight || 'normal',
                       align: child.align || 'left',
                       textDecoration: child.textDecoration || '',
                       width: child.width || 200,
                       height: child.height || child.fontSize * 1.2,
                       fill: child.fill,
                       stroke: child.stroke,
                       strokeWidth: child.strokeWidth,
                       rotation: child.rotation,
                       listening: false
                     }));
                     break;
                   case 'line':
                     group.add(new window.Konva.Line({
                       x: child.x,
                       y: child.y,
                       points: child.points,
                       fill: child.fill,
                       stroke: child.stroke,
                       strokeWidth: child.strokeWidth,
                       rotation: child.rotation,
                       listening: false
                     }));
                     break;
                   case 'image':
                     const childImage = new window.Image();
                     childImage.crossOrigin = 'anonymous';
                     childImage.src = child.imageUrl;
                     childImage.onload = () => {
                       group.add(new window.Konva.Image({
                         x: child.x,
                         y: child.y,
                         image: childImage,
                         width: child.width,
                         height: child.height,
                         rotation: child.rotation,
                         listening: false
                       }));
                       shapeLayer.batchDraw();
                     };
                     childImage.onerror = () => console.error('Image load error:', child.imageUrl);
                     break;
                 }
               });
               shapeLayer.add(group);
               break;
           }
         });
         stage.add(shapeLayer);
         stage.batchDraw();
       };

       useEffect(() => {
         templates.forEach((template, index) => {
           renderTemplateThumbnail(template, index);
         });
       }, [templates]);

       const handleCreateSlide = () => {
         const newSlide = {
           name: slideName || `Slide ${slides.length + 1}`,
           image: 'data:image/png;base64,placeholder',
           templateIds: []
         };
         createSlide(newSlide)
           .then(slide => {
             setSlides([...slides, slide]);
             setSlideName('');
             setSelectedTemplateIds([]);
             navigate(`/app/slides/${slide._id}`);
           })
           .catch(err => {
             console.error('Create slide error:', err);
             if (err.response?.status === 401) {
               navigate('/');
             } else {
               alert('Error creating slide: ' + err.message);
             }
           });
       };

       const handleCreateSlideFromTemplate = async () => {
         if (!selectedTemplateIds.length) {
           alert('Please select at least one template.');
           return;
         }
         const selectedTemplates = templates.filter(t => selectedTemplateIds.includes(t._id));
         if (!selectedTemplates.length) return;

         const stage = stageRef.current?.getStage();
         if (!stage) {
           alert('Canvas not initialized.');
           return;
         }

         let canvasWidth = 900;
         let canvasHeight = 600;
         let canvasBg = '#ffffff';
         selectedTemplates.forEach(template => {
           const { canvasWidth: w, canvasHeight: h, canvasBg: bg } = template.data;
           canvasWidth = Math.min(Math.max(canvasWidth, w), 1200); // Cap at 1200px
           canvasHeight = Math.min(Math.max(canvasHeight, h), 800); // Cap at 800px
           canvasBg = bg || canvasBg;
         });

         stage.removeChildren();
         stage.width(canvasWidth);
         stage.height(canvasHeight);
         stage.add(new window.Konva.Layer());

         const bgLayer = new window.Konva.Layer();
         bgLayer.add(new window.Konva.Rect({
           x: 0,
           y: 0,
           width: canvasWidth,
           height: canvasHeight,
           fill: canvasBg,
           listening: false
         }));
         stage.add(bgLayer);

         const shapeLayer = new window.Konva.Layer();
         let imageLoadCount = 0;
         let totalImages = 0;

         selectedTemplates.forEach((template, templateIndex) => {
           const { shapes } = template.data;
           shapes.forEach(shape => {
             if (shape.type === 'image') totalImages++;
             if (shape.type === 'group') {
               shape.children.forEach(child => {
                 if (child.type === 'image') totalImages++;
               });
             }
           });

           shapes.forEach(shape => {
             const commonProps = {
               x: shape.x + templateIndex * 10, // Offset to avoid overlap
               y: shape.y,
               fill: shape.fill,
               stroke: shape.stroke,
               strokeWidth: shape.strokeWidth,
               rotation: shape.rotation,
               listening: false
             };

             switch (shape.type) {
               case 'rect':
                 shapeLayer.add(new window.Konva.Rect({
                   ...commonProps,
                   width: shape.width,
                   height: shape.height
                 }));
                 break;
               case 'circle':
                 shapeLayer.add(new window.Konva.Circle({
                   ...commonProps,
                   radius: shape.radius
                 }));
                 break;
               case 'triangle':
                 shapeLayer.add(new window.Konva.RegularPolygon({
                   ...commonProps,
                   sides: 3,
                   radius: Math.max(shape.width, shape.height) / 2
                 }));
                 break;
               case 'text':
               case 'list':
                 shapeLayer.add(new window.Konva.Text({
                   ...commonProps,
                   text: shape.text,
                   fontSize: shape.fontSize,
                   fontFamily: shape.fontFamily || 'Arial',
                   fontStyle: shape.fontStyle || 'normal',
                   fontWeight: shape.fontWeight || 'normal',
                   align: shape.align || 'left',
                   textDecoration: shape.textDecoration || '',
                   width: shape.width || 200,
                   height: shape.height || shape.fontSize * 1.2
                 }));
                 break;
               case 'line':
                 shapeLayer.add(new window.Konva.Line({
                   ...commonProps,
                   points: shape.points
                 }));
                 break;
               case 'image':
                 const imageObj = new window.Image();
                 imageObj.crossOrigin = 'anonymous';
                 imageObj.src = shape.imageUrl;
                 imageObj.onload = () => {
                   shapeLayer.add(new window.Konva.Image({
                     ...commonProps,
                     image: imageObj,
                     width: shape.width,
                     height: shape.height
                   }));
                   shapeLayer.batchDraw();
                   imageLoadCount++;
                 };
                 imageObj.onerror = () => {
                   console.error('Image load error:', shape.imageUrl);
                   imageLoadCount++;
                 };
                 break;
               case 'group':
                 const group = new window.Konva.Group({
                   ...commonProps,
                   draggable: false
                 });
                 shape.children.forEach(child => {
                   switch (child.type) {
                     case 'rect':
                       group.add(new window.Konva.Rect({
                         x: child.x,
                         y: child.y,
                         width: child.width,
                         height: child.height,
                         fill: child.fill,
                         stroke: child.stroke,
                         strokeWidth: child.strokeWidth,
                         rotation: child.rotation,
                         listening: false
                       }));
                       break;
                     case 'circle':
                       group.add(new window.Konva.Circle({
                         x: child.x,
                         y: child.y,
                         radius: child.radius,
                         fill: child.fill,
                         stroke: child.stroke,
                         strokeWidth: child.strokeWidth,
                         rotation: child.rotation,
                         listening: false
                       }));
                       break;
                     case 'triangle':
                       group.add(new window.Konva.RegularPolygon({
                         x: child.x,
                         y: child.y,
                         sides: 3,
                         radius: Math.max(child.width, child.height) / 2,
                         fill: child.fill,
                         stroke: child.stroke,
                         strokeWidth: child.strokeWidth,
                         rotation: child.rotation,
                         listening: false
                       }));
                       break;
                     case 'text':
                     case 'list':
                       group.add(new window.Konva.Text({
                         x: child.x,
                         y: child.y,
                         text: child.text,
                         fontSize: child.fontSize,
                         fontFamily: child.fontFamily || 'Arial',
                         fontStyle: child.fontStyle || 'normal',
                         fontWeight: child.fontWeight || 'normal',
                         align: child.align || 'left',
                         textDecoration: child.textDecoration || '',
                         width: child.width || 200,
                         height: child.height || child.fontSize * 1.2,
                         fill: child.fill,
                         stroke: child.stroke,
                         strokeWidth: child.strokeWidth,
                         rotation: child.rotation,
                         listening: false
                       }));
                       break;
                     case 'line':
                       group.add(new window.Konva.Line({
                         x: child.x,
                         y: child.y,
                         points: child.points,
                         fill: child.fill,
                         stroke: child.stroke,
                         strokeWidth: child.strokeWidth,
                         rotation: child.rotation,
                         listening: false
                       }));
                       break;
                     case 'image':
                       const childImage = new window.Image();
                       childImage.crossOrigin = 'anonymous';
                       childImage.src = child.imageUrl;
                       childImage.onload = () => {
                         group.add(new window.Konva.Image({
                           x: child.x,
                           y: child.y,
                           image: childImage,
                           width: child.width,
                           height: child.height,
                           rotation: child.rotation,
                           listening: false
                         }));
                         shapeLayer.batchDraw();
                         imageLoadCount++;
                       };
                       childImage.onerror = () => {
                         console.error('Image load error:', child.imageUrl);
                         imageLoadCount++;
                       };
                       break;
                   }
                 });
                 shapeLayer.add(group);
                 break;
             }
           });
         });
         stage.add(shapeLayer);
         stage.batchDraw();

         // Wait for all images to load or fail
         const waitForImages = () => {
           return new Promise(resolve => {
             const checkImages = () => {
               if (imageLoadCount >= totalImages) {
                 resolve();
               } else {
                 setTimeout(checkImages, 100);
               }
             };
             checkImages();
           });
         };

         try {
           await waitForImages();
           const uri = stage.toDataURL({ pixelRatio: 1 }); // Reduced pixelRatio
           console.log('Base64 image size:', uri.length);
           const newSlide = {
             name: slideName || `Slide from ${selectedTemplates.map(t => t.name).join(', ')}`,
             image: uri,
             templateIds: selectedTemplateIds
           };
           const slide = await createSlide(newSlide);
           setSlides([...slides, slide]);
           setSlideName('');
           setSelectedTemplateIds([]);
           navigate(`/app/slides/${slide._id}`);
         } catch (err) {
           console.error('Create slide from template error:', err);
           if (err.response?.status === 401) {
             navigate('/');
           } else {
             alert('Error creating slide: ' + err.message);
           }
         } finally {
           stage.removeChildren();
           stage.width(900);
           stage.height(600);
         }
       };

       const handleTemplateToggle = (templateId) => {
         setSelectedTemplateIds(prev =>
           prev.includes(templateId)
             ? prev.filter(id => id !== templateId)
             : [...prev, templateId]
         );
       };

       return (
         <div className="slides-content">
           <h1>Slides</h1>
           <div className="slide-creator">
             <h2>Create New Slide</h2>
             <input
               type="text"
               className="slide-name-input"
               placeholder="Enter slide name"
               value={slideName}
               onChange={(e) => setSlideName(e.target.value)}
             />
             <div className="image-selector">
               {templates.map(template => (
                 <div key={template._id} className="image-option">
                   <input
                     type="checkbox"
                     checked={selectedTemplateIds.includes(template._id)}
                     onChange={() => handleTemplateToggle(template._id)}
                   />
                   <div className="thumbnail" style={{ width: '100px', height: '60px' }}>
                     <Stage
                       ref={el => (thumbnailRefs.current[template._id] = el)}
                       width={100}
                       height={60}
                     />
                   </div>
                   <span>{template.name}</span>
                 </div>
               ))}
             </div>
             <button
               className="add-slide-button"
               onClick={selectedTemplateIds.length ? handleCreateSlideFromTemplate : handleCreateSlide}
             >
               {selectedTemplateIds.length ? 'Create Slide from Templates' : 'Create Blank Slide'}
             </button>
           </div>
           <div className="slides-list">
             <h2>Your Slides</h2>
             {slides.map(slide => (
               <div key={slide._id} className="slide-item">
                 <h3>
                   <Link to={`/app/slides/${slide._id}`}>
                     {slide.name} {slide.templateIds?.length ? `(from ${slide.templateIds.map(t => t.name).join(', ')})` : ''}
                   </Link>
                 </h3>
                 <div className="slide-images">
                   <img src={slide.image} alt={slide.name} className="thumbnail" />
                 </div>
               </div>
             ))}
           </div>
           <div style={{ position: 'absolute', visibility: 'hidden' }}>
             <Stage ref={stageRef} width={900} height={600} />
           </div>
         </div>
       );
     }

     export default SlidesContent;