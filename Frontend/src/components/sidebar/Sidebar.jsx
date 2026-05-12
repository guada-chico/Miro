import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, Library, Heart, Users, BookMarked, Settings, HelpCircle } from "lucide-react";
import logoMiro from "../../assets/logo_miro_sf.png";
import { useSettings } from "../../context/SettingsContext";
import { getT } from "../../i18n";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const t = getT(settings.language).sidebar;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img 
          src={logoMiro} 
          alt="Miro" 
          onClick={() => navigate('/inicio')} 
          style={{ cursor: 'pointer' }} 
        />
      </div>
      
      <nav className="sidebar-menu">
        <p className="label">{t.menu}</p>
        <ul>
          <li className={`nav-item ${location.pathname === '/inicio' ? 'active' : ''}`} onClick={() => navigate('/inicio')}>
            <Home size={18}/> <span>{t.home}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/recomendaciones' ? 'active' : ''}`} onClick={() => navigate('/recomendaciones')}>
            <Sparkles size={18}/> <span>{t.recommendations}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/mis-libros' ? 'active' : ''}`} onClick={() => navigate('/mis-libros')}>
            <Library size={18}/> <span>{t.myBooks}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/favoritos' ? 'active' : ''}`} onClick={() => navigate('/favoritos')}>
            <Heart size={18}/> <span>{t.favorites}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/amigos' ? 'active' : ''}`} onClick={() => navigate('/amigos')}>
            <Users size={18}/> <span>{t.friends}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/clasicos' ? 'active' : ''}`} onClick={() => navigate('/clasicos')}>
            <BookMarked size={18}/> <span>{t.classics}</span>
          </li>
        </ul>

        <p className="label">{t.others}</p>
        <ul>
          <li className={`nav-item ${location.pathname === '/ajustes' ? 'active' : ''}`} onClick={() => navigate('/ajustes')}>
            <Settings size={18}/> <span>{t.settings}</span>
          </li>
          <li className={`nav-item ${location.pathname === '/ayuda' ? 'active' : ''}`} onClick={() => navigate('/ayuda')}>
            <HelpCircle size={18}/> <span>{t.help}</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

