import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/jsx/Login' // Asegúrate de que esta ruta sea la correcta

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return (
    <Router>
      <Routes>
        {/* Si no hay token, cualquier ruta nos manda al login */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* Ruta protegida ejemplo */}
        <Route 
          path="/inicio" 
          element={token ? <h1>Bienvenido a Miro</h1> : <Navigate to="/login" />} 
        />

        {/* Redirección inicial */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App