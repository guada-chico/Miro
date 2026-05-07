import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, MessageCircle, BookOpen, Star } from 'lucide-react';
import './Amigos.css';

export default function Amigos() {
  const navigate = useNavigate();
  
  // Datos de ejemplo para la lista de amigos
  const [amigos] = useState([
    {
      id: 1,
      nombre: "Carla Ramos",
      avatar: "https://i.pravatar.cc/150?u=carla",
      librosLeidos: 24,
      leyendo: "The Seven Husbands of Evelyn Hugo",
      online: true
    },
    {
      id: 2,
      nombre: "Marcos Soler",
      avatar: "https://i.pravatar.cc/150?u=marcos",
      librosLeidos: 12,
      leyendo: "Sapiens",
      online: false
    },
    {
      id: 3,
      nombre: "Elena Gil",
      avatar: "https://i.pravatar.cc/150?u=elena",
      librosLeidos: 45,
      leyendo: "The Silent Patient",
      online: true
    }
  ]);

  return (
    <div className="amigos-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Mis Amigos</h1>
        </div>
        <p>Conecta con otros lectores y descubre qué están leyendo</p>
      </header>

      {/* SECCIÓN DE BUSCADOR Y SUGERENCIAS */}
      <div className="amigos-top-bar">
        <div className="search-bar-amigos">
          <Search size={20} color="#bbb" />
          <input type="text" placeholder="Buscar por nombre o usuario..." />
        </div>
        <button className="add-friend-btn">
          <UserPlus size={18} /> Invitar amigos
        </button>
      </div>

      <div className="amigos-grid">
        {amigos.map((amigo) => (
          <div key={amigo.id} className="amigo-card">
            <div className="amigo-header">
              <div className="avatar-status-wrapper">
                <img src={amigo.avatar} alt={amigo.nombre} className="amigo-avatar" />
                <span className={`status-dot ${amigo.online ? 'online' : 'offline'}`}></span>
              </div>
              <div className="amigo-main-info">
                <h4>{amigo.nombre}</h4>
                <p>{amigo.librosLeidos} libros leídos[cite: 1]</p>
              </div>
            </div>

            <div className="amigo-current-reading">
              <div className="reading-label">
                <BookOpen size={14} color="#ff6b35" />
                <span>Leyendo ahora</span>
              </div>
              <p className="reading-book-title">{amigo.leyendo}</p>
            </div>

            <div className="amigo-actions">
              <button className="action-btn chat">
                <MessageCircle size={18} /> Chat
              </button>
              <button className="action-btn profile">Ver perfil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}