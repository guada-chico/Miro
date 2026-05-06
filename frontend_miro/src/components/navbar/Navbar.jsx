import { useState, useEffect, useRef } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Creamos referencias para los contenedores
  const userMenuRef = useRef(null);
  const notiMenuRef = useRef(null);

  // Escuchamos clics en todo el documento
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el menú de usuario está abierto y el clic NO fue dentro de su referencia, lo cerramos
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      // Lo mismo para las notificaciones
      if (showNotifications && notiMenuRef.current && !notiMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Limpiamos el evento al desmontar el componente para evitar problemas de memoria
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

  const notifications = []; 

  return (
    <header className="navbar-top">
      <div className="navbar-actions">
        
        {/* SECCIÓN NOTIFICACIONES - Añadimos la ref */}
        <div className="notification-container" ref={notiMenuRef}>
          <div 
            className="icon-bell" 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && <span className="notification-dot"></span>}
          </div>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">Notificaciones</div>
              <div className="dropdown-content">
                {notifications.length > 0 ? (
                  notifications.map((n, i) => <div key={i} className="noti-item">{n}</div>)
                ) : (
                  <p className="no-data">No hay notificaciones</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SECCIÓN USUARIO - Añadimos la ref */}
        <div 
          className="user-pill" 
          ref={userMenuRef}
          onClick={() => {
            setShowUserMenu(!showUserMenu);
            setShowNotifications(false);
          }}
        >
          <div className="user-avatar-container">
            <User size={20} className="user-icon-default" />
          </div>
          <span className="user-name">Davis Workman</span>
          <ChevronDown size={14} className={showUserMenu ? 'rotate' : ''} />

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-opt"><User size={14}/> Mi Perfil</div>
              <div className="dropdown-opt"><Settings size={14}/> Ajustes</div>
              <hr className="divider" />
              <div className="dropdown-opt logout-opt">
                <LogOut size={14}/> Cerrar sesión
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}