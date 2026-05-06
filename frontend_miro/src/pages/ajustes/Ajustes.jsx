import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Moon, Bell, Eye, ShieldCheck, Trash2 } from 'lucide-react';
import './Ajustes.css';

export default function Ajustes() {
  const navigate = useNavigate();
  
  // Estados para los interruptores (toggles)
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);

  return (
    <div className="ajustes-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Ajustes</h1>
        </div>
        <p>Configura tu experiencia y preferencias de la aplicación</p>
      </header>

      <div className="ajustes-content">
        {/* PREFERENCIAS DE INTERFAZ */}
        <section className="ajustes-section">
          <div className="section-header">
            <Eye size={20} />
            <h3>Apariencia e Idioma</h3>
          </div>
          
          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Moon size={18} /></div>
              <div>
                <strong>Modo Oscuro</strong>
                <p>Cambia el tema de la aplicación a tonos oscuros</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Globe size={18} /></div>
              <div>
                <strong>Idioma</strong>
                <p>Selecciona tu idioma preferido</p>
              </div>
            </div>
            <select className="ajuste-select">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </section>

        {/* NOTIFICACIONES */}
        <section className="ajustes-section">
          <div className="section-header">
            <Bell size={20} />
            <h3>Notificaciones</h3>
          </div>
          
          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Bell size={18} /></div>
              <div>
                <strong>Notificaciones por correo</strong>
                <p>Recibe alertas sobre nuevos libros y amigos</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* PRIVACIDAD Y CUENTA */}
        <section className="ajustes-section">
          <div className="section-header">
            <ShieldCheck size={20} />
            <h3>Privacidad y Cuenta</h3>
          </div>
          
          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Eye size={18} /></div>
              <div>
                <strong>Perfil Público</strong>
                <p>Permite que otros usuarios vean tus listas de lectura</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={publicProfile} onChange={() => setPublicProfile(!publicProfile)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajuste-item delete-action">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg danger"><Trash2 size={18} /></div>
              <div>
                <strong>Eliminar cuenta</strong>
                <p>Borra permanentemente todos tus datos</p>
              </div>
            </div>
            <button className="btn-danger-outline">Eliminar</button>
          </div>
        </section>
      </div>
    </div>
  );
}