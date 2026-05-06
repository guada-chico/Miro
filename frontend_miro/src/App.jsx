import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Inicio from './pages/inicio/Inicio';
import Biblioteca from './pages/biblioteca/Biblioteca';
import Recomendaciones from './pages/recomendaciones/Recomendaciones';
import Favoritos from './pages/favoritos/Favoritos';
import Perfil from './pages/perfil/Perfil';
import Ajustes from './pages/ajustes/Ajustes';
import Ayuda from './pages/ayuda/Ayuda';
import Login from './pages/login/Login.jsx';
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
              <Route path="/login" element={<Login />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/recomendaciones" element={<Recomendaciones />} />
              <Route path="/mis-libros" element={<Biblioteca />} />
              <Route path="/favoritos" element={<Favoritos/>} />
              <Route path="/perfil" element={<Perfil/>} />
              <Route path="/ajustes" element={<Ajustes/>} />
              <Route path="/ayuda" element={<Ayuda/>} />
              
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