import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Camera, Save, LogOut } from 'lucide-react';
import './Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();
  
  // Estados para los campos (simulando datos de usuario)
  const [nombre, setNombre] = useState('Guada Chico');
  const [correo, setCorreo] = useState('guadachico@ejemplo.com');

  return (
    <div className="perfil-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Mi Perfil</h1>
        </div>
        <p>Gestiona tu información personal y ajustes de cuenta</p>
      </header>

      <div className="perfil-content">
        {/* SECCIÓN IZQUIERDA: FOTO Y RESUMEN */}
        <aside className="perfil-sidebar-info">
          <div className="avatar-wrapper">
            <img 
              src="https://ui-avatars.com/api/?name=Guada+Chico&background=ff6b35&color=fff&size=150" 
              alt="Avatar" 
              className="perfil-avatar"
            />
            <button className="change-photo-btn">
              <Camera size={18} />
            </button>
          </div>
          <h2>{nombre}</h2>
          <p>{correo}</p>
          <button className="logout-perfil-btn" onClick={() => navigate('/login')}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </aside>

        {/* SECCIÓN DERECHA: FORMULARIOS */}
        <div className="perfil-forms">
          {/* INFORMACIÓN PERSONAL */}
          <section className="perfil-card">
            <h3><User size={20} /> Información Personal</h3>
            <div className="form-group">
              <label>Nombre de usuario</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email" 
                  value={correo} 
                  onChange={(e) => setCorreo(e.target.value)} 
                />
              </div>
            </div>
            <button className="save-btn">
              <Save size={18} /> Guardar cambios
            </button>
          </section>

          {/* SEGURIDAD / CONTRASEÑA */}
          <section className="perfil-card">
            <h3><Lock size={20} /> Seguridad</h3>
            <div className="form-group">
              <label>Contraseña actual</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="form-group">
              <label>Nueva contraseña</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input type="password" placeholder="Mínimo 8 caracteres" />
              </div>
            </div>
            <button className="save-btn secondary">
              Actualizar contraseña
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}