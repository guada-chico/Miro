import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';
import Inicio from './pages/inicio/Inicio';
import Login from './pages/login/Login';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <BrowserRouter>
      {token ? (
        <div className="app-layout">
          <Sidebar />
          <div className="content-area">
            <Navbar />
            <main className="main-view">
              <Routes>
                <Route path="/inicio" element={<Inicio />} />
                <Route path="*" element={<Navigate to="/inicio" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}