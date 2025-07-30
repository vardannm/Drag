import React, { useState, useContext } from 'react';
     import { Link } from 'react-router-dom';
     import { AuthContext } from '../context/AuthContext';
     import './Login.css';

     function Login() {
       const { login } = useContext(AuthContext);
       const [loginInput, setLoginInput] = useState('');
       const [password, setPassword] = useState('');
       const [error, setError] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           await login(loginInput, password);
         } catch (err) {
           setError(err.message || err || 'Login failed');
         }
       };

       return (
         <div className="login-container">
           <h1>ScreenCanvas - Login</h1>
           <form onSubmit={handleSubmit} className="login-form">
             <input
               type="text"
               value={loginInput}
               onChange={(e) => setLoginInput(e.target.value)}
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
               autoComplete="current-password"
             />
             <button type="submit">Login</button>
             {error && <p className="error">{error}</p>}
             <p>
               Don't have an account? <Link to="/register">Register</Link>
             </p>
           </form>
         </div>
       );
     }

     export default Login;