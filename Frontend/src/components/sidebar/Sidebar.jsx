import { useNavigate, useLocation } from "react-router-dom";
import { Home, Sparkles, Library, Heart, Users, BookMarked, Settings, HelpCircle, LogOut } from "lucide-react";
import logoMiro from "../../assets/logo_miro_sf.png";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

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
        <p className="label">MENU</p>
        <ul>
          <li 
            className={`nav-item ${location.pathname === '/inicio' ? 'active' : ''}`}
            onClick={() => navigate('/inicio')}
          >
            <Home size={18}/> <span>Inicio</span>
          </li>

          <li 
            className={`nav-item ${location.pathname === '/recomendaciones' ? 'active' : ''}`}
            onClick={() => navigate('/recomendaciones')}
          >
            <Sparkles size={18}/> <span>Recomendaciones</span>
          </li>

          <li 
            className={`nav-item ${location.pathname === '/mis-libros' ? 'active' : ''}`}
            onClick={() => navigate('/mis-libros')}
            >
            <Library size={18}/> <span>Mis libros</span>
        </li>
          <li 
            className={`nav-item ${location.pathname === '/favoritos' ? 'active' : ''}`}
            onClick={() => navigate('/favoritos')}
          >
            <Heart size={18}/> <span>Favoritos</span>
          </li>
          <li 
            className={`nav-item ${location.pathname === '/amigos' ? 'active' : ''}`}
            onClick={() => navigate('/amigos')}
          >
            <Users size={18}/> <span>Amigos</span>
          </li>
          <li 
            className={`nav-item ${location.pathname === '/clasicos' ? 'active' : ''}`}
            onClick={() => navigate('/clasicos')}
          >
            <BookMarked size={18}/> <span>Clásicos gratis</span>
          </li>
        </ul>

        <p className="label">OTROS</p>
        <ul>
          <li 
            className={`nav-item ${location.pathname === '/ajustes' ? 'active' : ''}`}
            onClick={() => navigate('/ajustes')}
          >
            <Settings size={18}/> <span>Ajustes</span>
          </li>
          <li 
            className={`nav-item ${location.pathname === '/ayuda' ? 'active' : ''}`} 
            onClick={() => navigate('/ayuda')}
            >
              <HelpCircle size="{18}"/> <span>Ayuda</span>
          </li>
          <li className="nav-item logout-btn" onClick={() => navigate('/login')}>
            <LogOut size={18}/> <span>Cerrar sesión</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}