import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login'; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // IMPORTANTE: Asegúrate de que no haya NADA aquí arriba (como useNavigate)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Si ves esto, el error es el archivo Login.jsx</div>} />
        <Route 
          path="/inicio" 
          element={token ? <div style={{padding: '50px'}}><h1>Bienvenido a Miro</h1></div> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}