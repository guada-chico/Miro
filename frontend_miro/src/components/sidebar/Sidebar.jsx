import { Home, Sparkles, Library, Heart, Users, Settings, HelpCircle, LogOut } from 'lucide-react';
import logoMiro from '../../assets/logo_miro_sf.png';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src={logoMiro} alt="Miro" />
      </div>
      <nav className="sidebar-menu">
        <p className="label">MENU</p>
        <ul>
          <li className="active"><Home size={18}/> Inicio</li>
          <li><Sparkles size={18}/> Recomendaciones</li>
          <li><Library size={18}/> Mis libros</li>
          <li><Heart size={18}/> Favoritos</li>
          <li><Users size={18}/> Amigos</li>
        </ul>
        <p className="label">OTROS</p>
        <ul>
          <li><Settings size={18}/> Ajustes</li>
          <li><HelpCircle size={18}/> Ayuda</li>
          <li className="logout-btn"><LogOut size={18}/> Cerrar sesión</li>
        </ul>
      </nav>
    </aside>
  );
}