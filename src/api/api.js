import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchDevices = () => api.get('/devices').then((res) => res.data);
export const createDevice = (device) => api.post('/devices', device).then((res) => res.data);
export const fetchDevice = (id) => api.get(`/devices/${id}`).then((res) => res.data);
export const updateDevice = (id, device) => api.put(`/devices/${id}`, device).then((res) => res.data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`);

export const fetchSlides = () => api.get('/slides').then((res) => res.data);
export const createSlide = (slide) => api.post('/slides', slide).then((res) => res.data);
export const updateSlide = (id, slide) => api.put(`/slides/${id}`, slide).then((res) => res.data);

export const fetchTemplates = () => api.get('/templates').then((res) => res.data);
export const fetchTemplate = (id) => api.get(`/templates/${id}`).then((res) => res.data);
export const createTemplate = (template) => api.post('/templates', template).then((res) => res.data);
export const updateTemplate = (id, template) => api.put(`/templates/${id}`, template).then((res) => res.data);

export const fetchContent = (templateId, shapeId) => api.get(`/content/${templateId}/${shapeId}`).then((res) => res.data);
export const updateContent = (templateId, shapeId, text) => api.put(`/content/${templateId}/${shapeId}`, { text }).then((res) => res.data);

export default api;