import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Forecast from "./pages/Forecast";
import Peaks from "./pages/Peaks";
import Anomalies from "./pages/Anomalies";
import Recommendations from "./pages/Recommendations";
import Simulation from "./pages/Simulation";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="forecast" element={<Forecast />} />
        <Route path="peaks" element={<Peaks />} />
        <Route path="anomalies" element={<Anomalies />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="reports" element={<Reports />} />
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
      <MainLayout />
    </ProtectedRoute>
  }
></Route>
      </Route>
    </Routes>
  );
}

export default App;