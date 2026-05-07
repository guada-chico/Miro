import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, MessageCircle, BookOpen } from 'lucide-react';
import { getMyFriends, sendFriendRequest } from '../../services/friendship-service';
import './Amigos.css';

export default function Amigos() {
  const navigate = useNavigate();
  const [amigos, setAmigos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiverId, setReceiverId] = useState('');

  useEffect(() => {
    getMyFriends()
      .then(setAmigos)
      .catch(() => setAmigos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSendRequest = async () => {
    const id = parseInt(receiverId);
    if (!id) return;
    try {
      await sendFriendRequest(id);
      setReceiverId('');
      alert('Solicitud enviada');
    } catch {
      alert('No se pudo enviar la solicitud');
    }
  };

  return (
    <div className="amigos-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Mis amigos</h1>
        </div>
        <p>Conecta con otros lectores y descubre qué están leyendo</p>
      </header>

      {/* SECCIÓN DE BUSCADOR Y ENVÍO DE SOLICITUD */}
      <div className="amigos-top-bar">
        <div className="search-bar-amigos">
          <Search size={20} color="#bbb" />
          <input
            type="number"
            placeholder="Nombre del usuario para agregar..."
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </div>
        <button className="add-friend-btn" onClick={handleSendRequest}>
          <UserPlus size={18} /> Enviar solicitud
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>Cargando amigos...</p>
      ) : (
        <div className="amigos-grid">
          {amigos.length > 0 ? amigos.map((amigo) => (
            <div key={amigo.id} className="amigo-card">
              <div className="amigo-header">
                <div className="avatar-status-wrapper">
                  <img
                    src={`https://i.pravatar.cc/150?u=${amigo.id}`}
                    alt={amigo.name}
                    className="amigo-avatar"
                  />
                </div>
                <div className="amigo-main-info">
                  <h4>{amigo.name}</h4>
                  <p>{amigo.email}</p>
                </div>
              </div>

              <div className="amigo-current-reading">
                <div className="reading-label">
                  <BookOpen size={14} color="#ff6b35" />
                  <span>Amigo desde</span>
                </div>
                <p className="reading-book-title">
                  {amigo.createdAt ? new Date(amigo.createdAt).toLocaleDateString() : 'Recientemente'}
                </p>
              </div>

              <div className="amigo-actions">
                <button className="action-btn profile">Ver perfil</button>
              </div>
            </div>
          )) : (
            <p style={{ textAlign: 'center', color: '#aaa' }}>Aún no tienes amigos. ¡Envía una solicitud!</p>
          )}
        </div>
      )}
    </div>
  );
}