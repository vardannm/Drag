import axios from 'axios';

     const API_URL = 'http://localhost:5000/api';

     const api = axios.create({
       baseURL: API_URL,
       headers: { 'Content-Type': 'application/json' }
     });

     api.interceptors.request.use(config => {
       const token = localStorage.getItem('token');
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     }, error => {
       console.error('API request error:', error);
       return Promise.reject(error);
     });

     export const fetchDevices = async () => {
       const response = await api.get('/devices');
       return response.data;
     };

     export const createDevice = async (device) => {
       const response = await api.post('/devices', device);
       return response.data;
     };

     export const fetchDevice = async (id) => {
       const response = await api.get(`/devices/${id}`);
       return response.data;
     };

     export const updateDevice = async (id, device) => {
       const response = await api.put(`/devices/${id}`, device);
       return response.data;
     };

     export const fetchSlides = async () => {
       const response = await api.get('/slides');
       return response.data;
     };

     export const createSlide = async (slide) => {
       const response = await api.post('/slides', slide);
       return response.data;
     };

     export const updateSlide = async (id, slide) => {
       const response = await api.put(`/slides/${id}`, slide);
       return response.data;
     };

     export const fetchTemplates = async () => {
       const response = await api.get('/templates');
       return response.data;
     };

     export const fetchTemplate = async (id) => {
       const response = await api.get(`/templates/${id}`);
       return response.data;
     };

     export const createTemplate = async (template) => {
       const response = await api.post('/templates', template);
       return response.data;
     };

     export const updateTemplate = async (id, template) => {
       const response = await api.put(`/templates/${id}`, template);
       return response.data;
     };

     export const fetchContent = async (templateId, shapeId) => {
       const response = await api.get(`/content/${templateId}/${shapeId}`);
       return response.data;
     };

     export const updateContent = async (templateId, shapeId, text) => {
       const response = await api.put(`/content/${templateId}/${shapeId}`, { text });
       return response.data;
     };