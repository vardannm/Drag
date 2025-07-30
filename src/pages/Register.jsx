import React, { useState, useContext } from 'react';
     import { Link } from 'react-router-dom';
     import { AuthContext } from '../context/AuthContext';
     import './Register.css';

     function Register() {
       const { register } = useContext(AuthContext);
       const [name, setName] = useState('');
       const [login, setLogin] = useState('');
       const [password, setPassword] = useState('');
       const [error, setError] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           await register(name, login, password);
         } catch (err) {
           setError(err.message || err || 'Registration failed');
         }
       };

       return (
         <div className="register-container">
           <h1>ScreenCanvas - Register</h1>
           <form onSubmit={handleSubmit} className="register-form">
             <input
               type="text"
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="Name"
               required
               autoComplete="name"
             />
             <input
               type="text"
               value={login}
               onChange={(e) => setLogin(e.target.value)}
               placeholder="Login"
               required
               autoComplete="username"
             />
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Password"
               required
               autoComplete="new-password"
             />
             <button type="submit">Register</button>
             {error && <p className="error">{error}</p>}
             <p>
               Already have an account? <Link to="/">Login</Link>
             </p>
           </form>
         </div>
       );
     }

     export default Register;