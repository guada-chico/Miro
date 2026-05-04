import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// IMPORTANTE: 'login' en minúscula para que coincida exactamente con tu carpeta
import Login from './pages/login/Login'; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        <Route 
          path="/inicio" 
          element={token ? <div style={{padding: '50px'}}><h1>Bienvenido a Miro</h1></div> : <Navigate to="/login" />} 
        />

        {/* Cualquier otra ruta nos manda al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}