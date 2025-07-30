import React, { useState, useEffect } from 'react';
     import { Link, useNavigate } from 'react-router-dom';
     import { fetchTemplates, createTemplate } from '../api/api';
     import './TemplatesContent.css';

     function TemplatesContent() {
       const navigate = useNavigate();
       const [templates, setTemplates] = useState([]);

       useEffect(() => {
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

       const handleCreateTemplate = () => {
         const newTemplate = {
           name: `Template ${templates.length + 1}`,
           path: `/templates/template-${templates.length + 1}.json`,
           data: {
             shapes: [],
             canvasWidth: 900,
             canvasHeight: 600,
             canvasBg: '#ffffff'
           }
         };
         createTemplate(newTemplate)
           .then(template => {
             setTemplates([...templates, template]);
             navigate(`/app/templates/${template._id}`);
           })
           .catch(err => {
             console.error('Create template error:', err);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       };

       return (
         <div className="templates-content">
           <h1>Templates</h1>
           <button className="templateButton" onClick={handleCreateTemplate}>
             Create New Template
           </button>
           <div className="template-list">
             {templates.map(template => (
               <div key={template._id} className="template-item">
                 <Link
                   to={`/app/templates/${template._id}`}
                   target="_blank"
                   rel="noopener noreferrer"
                 >
                   {template.name}
                 </Link>
               </div>
             ))}
           </div>
         </div>
       );
     }

     export default TemplatesContent;