import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Inicio from './pages/inicio/Inicio';
import Recomendaciones from './pages/recomendaciones/Recomendaciones'; // <-- Asegúrate de que esto existe
import './App.css';

export default function App() {
  // const token = true; // Simulación de sesión

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="content-area">
          <Navbar />
          <main className="main-view">
            <Routes>
              {/* Estas rutas deben coincidir EXACTAMENTE con lo que pones en navigate() */}
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/recomendaciones" element={<Recomendaciones />} />
              
              {/* Redirección por defecto */}
              <Route path="/" element={<Navigate to="/inicio" />} />
              <Route path="*" element={<Navigate to="/inicio" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}