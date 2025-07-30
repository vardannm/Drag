import React, { useState, useEffect } from 'react';
     import { useParams, useNavigate } from 'react-router-dom';
import CanvasEditor from "./components/CanvasItem/CanvasEditor";
     import api from './api/api';
     import './Template.css';

     function Template() {
       const { templateId } = useParams();
       const navigate = useNavigate();
       const [templateData, setTemplateData] = useState(null);

       useEffect(() => {
         if (templateId && templateId !== 'new') {
           api.get(`/templates/${templateId}`)
             .then(response => {
               console.log('Fetched template data:', response.data);
               setTemplateData(response.data.data);
             })
             .catch(err => {
               console.error('Error fetching template:', err);
               if (err.response?.status === 401) {
                 navigate('/');
               }
             });
         }
       }, [templateId, navigate]);

       const handleSaveTemplate = (canvasData) => {
         if (!templateId || templateId === 'new') {
           // For new templates, handled by TemplatesContent
           return;
         }
         api.put(`/templates/${templateId}`, { data: canvasData })
           .then(response => {
             console.log('Template updated:', response.data);
             alert('Template saved successfully!');
           })
           .catch(err => {
             console.error('Error saving template:', err);
             if (err.response?.status === 401) {
               navigate('/');
             } else {
               alert('Error saving template: ' + err.message);
             }
           });
       };

       return (
         <div className="template-editor">
           <CanvasEditor templateData={templateData} onSaveTemplate={handleSaveTemplate} />
         </div>
       );
     }

     export default Template;