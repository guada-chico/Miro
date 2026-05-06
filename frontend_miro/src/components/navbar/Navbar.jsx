import { Bell, ChevronDown, User } from 'lucide-react'; // Importamos User
import './Navbar.css';

export default function Navbar() {
  // En el futuro, este 'userPhoto' vendrá de tu base de datos o estado
  const userPhoto = null; 

  return (
    <header className="navbar-top">
      <div className="navbar-actions">
        <div className="icon-bell"><Bell size={20} /></div>
        
        <div className="user-pill">
          <div className="user-avatar-container">
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="user-photo" />
            ) : (
              <User size={20} className="user-icon-default" />
            )}
          </div>
          <span className="user-name">Davis Workman</span>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}