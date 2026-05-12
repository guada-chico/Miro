import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { getUserName, logout } from '../../services/auth-service';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = getT(settings.language).navbar;

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('Usuario');

  const userMenuRef = useRef(null);
  const notiMenuRef = useRef(null);

  useEffect(() => {
    const name = getUserName();
    if (name) setUserName(name);

    const handleProfileUpdated = (e) => {
      if (e.detail?.name) setUserName(e.detail.name);
    };
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (showNotifications && notiMenuRef.current && !notiMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [];

  return (
    <header className="navbar-top">
      <div className="navbar-actions">

        <div className="notification-container" ref={notiMenuRef}>
          <div
            className="icon-bell"
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
          >
            <Bell size={20} />
            {notifications.length > 0 && <span className="notification-dot"></span>}
          </div>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">{t.notifications}</div>
              <div className="dropdown-content">
                {notifications.length > 0
                  ? notifications.map((n, i) => <div key={i} className="noti-item">{n}</div>)
                  : <p className="no-data">{t.noNotifications}</p>
                }
              </div>
            </div>
          )}
        </div>

        <div
          className="user-pill"
          ref={userMenuRef}
          onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
        >
          <div className="user-avatar-container">
            <User size={20} className="user-icon-default" />
          </div>
          <span className="user-name">{userName}</span>
          <ChevronDown size={14} className={showUserMenu ? 'rotate' : ''} />

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-opt" onClick={() => navigate('/perfil')}>
                <User size={14} /> {t.myProfile}
              </div>
              <div className="dropdown-opt" onClick={() => navigate('/ajustes')}>
                <Settings size={14} /> {t.settings}
              </div>
              <hr className="divider" />
              <div className="dropdown-opt logout-opt" onClick={handleLogout}>
                <LogOut size={14} /> {t.logout}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
