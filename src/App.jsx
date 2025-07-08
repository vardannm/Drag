import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero/Hero";
import DeviceContent from "./pages/Device";
import DeviceDetail from "./pages/DeviceDetail";
import SlidesContent from "./pages/SlidesContent";
import TemplatesContent from "./pages/TemplatesContent";
import Template from "./Template"; // Import Template.jsx

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />}>
          <Route index element={<WelcomeContent />} />
          <Route path="device" element={<DeviceContent />} />
          <Route path="device/:id" element={<DeviceDetail />} />
          <Route path="slides" element={<SlidesContent />} />
          <Route path="templates" element={<TemplatesContent />} />
          <Route path="templates/new" element={<Template />} />
          <Route path="templates/:templateId" element={<Template />} />
        </Route>
      </Routes>
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