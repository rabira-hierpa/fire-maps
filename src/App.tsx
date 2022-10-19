import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Map3D from "./pages/map-3d";

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="3d-map" element={<Map3D />} />
    </Routes>
  );
};

export default App;
