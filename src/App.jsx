import React, { useContext } from 'react';
     import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
     import { AuthContext, AuthProvider } from './context/AuthContext';
     import Hero from './Hero/Hero';
     import DeviceContent from './pages/Device';
     import DeviceDetail from './pages/DeviceDetail';
     import SlidesContent from './pages/SlidesContent';
     import TemplatesContent from './pages/TemplatesContent';
     import Template from './Template';
     import Login from './pages/Login';
     import Register from './pages/Register';

     function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<ProtectedRoute><Hero /></ProtectedRoute>}>
            <Route index element={<WelcomeContent />} />
            <Route path="device" element={<DeviceContent />} />
            <Route path="device/:id" element={<DeviceDetail />} />
            <Route path="slides" element={<SlidesContent />} />
            <Route path="templates" element={<TemplatesContent />} />
            <Route path="templates/new" element={<Template />} />
            <Route path="templates/:templateId" element={<Template />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const WelcomeContent = () => (
  <div className="content-text">
    <h1>Welcome to ScreenCanvas</h1>
    <p>We control</p>
  </div>
);

export default App;