import React from 'react';
     import { Link, useLocation } from 'react-router-dom';
     import './Breadcrumbs.css';

     function Breadcrumbs() {
       const location = useLocation();
       const pathnames = location.pathname.split('/').filter((x) => x);

       return (
         <div className="breadcrumbs">
           <Link to="/app">Home</Link>
           {pathnames.map((name, index) => {
             const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
             // Skip rendering breadcrumb for 'app' to avoid duplication
             if (name === 'app' && index === 0) {
               return null;
             }
             return (
               <span key={index}>
                 {' > '}
                 <Link to={routeTo}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
               </span>
             );
           })}
         </div>
       );
     }

     export default Breadcrumbs;