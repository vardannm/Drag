import React, { useState, useEffect } from 'react';
     import { Link, useNavigate } from 'react-router-dom';
     import { fetchTemplates, createTemplate } from '../api/api';
     import './TemplatesContent.css';

     function TemplatesContent() {
       const navigate = useNavigate();
       const [templates, setTemplates] = useState([]);

       useEffect(() => {
         fetchTemplates()
           .then(data => setTemplates(data))
           .catch(err => {
             console.error(err);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       }, [navigate]);

       const handleCreateTemplate = () => {
         const newTemplate = {
           id: templates.length + 1,
           name: `Template ${templates.length + 1}`,
           path: `/templates/template-${templates.length + 1}.json`
         };
         createTemplate(newTemplate)
           .then(template => {
             setTemplates([...templates, template]);
             navigate(`/app/templates/${template.id}`);
           })
           .catch(err => {
             console.error(err);
             if (err.response?.status === 401) {
               navigate('/');
             }
           });
       };

       return (
         <div className="templates-content">
           <h1>Templates</h1>
           <button className="templateButton" onClick={handleCreateTemplate}>Create New Template</button>
           <div className="template-list">
             {templates.map(template => (
               <div key={template.id} className="template-item">
                 <Link
                   to={`/app/templates/${template.id}`}
                   target="_blank"
                   rel="noopener noreferrer"
                   state={{ templatePath: template.path }}
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