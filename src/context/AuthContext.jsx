import React, { createContext, useState, useEffect } from 'react';
     import { useNavigate } from 'react-router-dom';
     import {jwtDecode} from 'jwt-decode';
     import axios from 'axios';

     export const AuthContext = createContext();

     export const AuthProvider = ({ children }) => {
       const [user, setUser] = useState(null);
       const [token, setToken] = useState(localStorage.getItem('token') || '');
       const [loading, setLoading] = useState(true); // Add loading state
       const navigate = useNavigate();

       useEffect(() => {
         console.log('AuthContext: Initial token:', token);
         if (token) {
           try {
             const decoded = jwtDecode(token);
             console.log('AuthContext: Decoded JWT:', decoded);
             if (decoded.exp * 1000 < Date.now()) {
               console.log('AuthContext: Token expired');
               setUser(null);
               setToken('');
               localStorage.removeItem('token');
               navigate('/');
             } else {
               setUser({ name: decoded.name, login: decoded.login });
               localStorage.setItem('token', token);
             }
           } catch (err) {
             console.error('AuthContext: Token decode error:', err);
             setUser(null);
             setToken('');
             localStorage.removeItem('token');
             navigate('/');
           }
         } else {
           console.log('AuthContext: No token found');
           setUser(null);
         }
         setLoading(false); // Set loading false after token check
       }, [token, navigate]);

       const login = async (login, password) => {
         try {
           const response = await axios.post('http://localhost:5000/api/auth/login', { login, password });
           console.log('AuthContext: Login response:', response.data);
           const { token, user } = response.data;
           localStorage.setItem('token', token);
           setToken(token);
           setUser({ name: user.name, login: user.login });
           navigate('/app/device');
         } catch (err) {
           console.error('AuthContext: Login error:', err);
           throw err.response?.data?.error || 'Login failed';
         }
       };

       const register = async (name, login, password) => {
         try {
           const response = await axios.post('http://localhost:5000/api/auth/register', { name, login, password });
           console.log('AuthContext: Register response:', response.data);
           const { token, user } = response.data;
           localStorage.setItem('token', token);
           setToken(token);
           setUser({ name: user.name, login: user.login });
           navigate('/app/device');
         } catch (err) {
           console.error('AuthContext: Register error:', err);
           throw err.response?.data?.error || 'Registration failed';
         }
       };

       const logout = () => {
         console.log('AuthContext: Logging out');
         setUser(null);
         setToken('');
         localStorage.removeItem('token');
         navigate('/');
       };

       if (loading) {
         return <div>Loading...</div>; // Prevent render until token is checked
       }

       return (
         <AuthContext.Provider value={{ user, token, login, register, logout }}>
           {children}
         </AuthContext.Provider>
       );
     };