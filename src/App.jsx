import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero/Hero";
import DeviceContent from "./pages/Device";
import DeviceDetail from "./pages/DeviceDetail"; // Import the new DeviceDetail page
import SlidesContent from "./pages/SlidesContent";
import TemplatesContent from "./pages/TemplatesContent";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />}>
          <Route index element={<WelcomeContent />} />
          <Route path="device" element={<DeviceContent />} />
          {/* Nested route for individual device pages */}
          <Route path="device/:id" element={<DeviceDetail />} />
          <Route path="slides" element={<SlidesContent />} />
          <Route path="templates" element={<TemplatesContent />} />
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
