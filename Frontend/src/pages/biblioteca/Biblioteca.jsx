import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Calendar as CalendarIcon, Trophy, Plus, ArrowLeft } from 'lucide-react';
import './Biblioteca.css';

export default function Biblioteca() {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('leyendo');

  // 1. Estructura de datos organizada por categorías
  const misLibrosData = {
    leyendo: [
      { id: 1, title: "Atomic Habits", author: "James Clear", progress: 75, img: "https://m.media-amazon.com/images/I/81wgcwbW6UL.jpg" },
      { id: 2, title: "Deep Work", author: "Cal Newport", progress: 30, img: "https://m.media-amazon.com/images/I/417P969h7uL.jpg" }
    ],
    leídos: [
      { id: 3, title: "The Alchemist", author: "Paulo Coelho", progress: 100, img: "https://m.media-amazon.com/images/I/71aFt4+OTzL.jpg" },
      { id: 4, title: "Zero to One", author: "Peter Thiel", progress: 100, img: "https://m.media-amazon.com/images/I/71uAI28RwFL.jpg" }
    ],
    "por leer": [
      { id: 5, title: "The Psychology of Money", author: "Morgan Housel", progress: 0, img: "https://m.media-amazon.com/images/I/71TR7Z7N9RL.jpg" },
      { id: 6, title: "Clean Code", author: "Robert C. Martin", progress: 0, img: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg" }
    ]
  };

  const retoAnual = { objetivo: 24, leidos: 12 };
  const porcentajeReto = (retoAnual.leidos / retoAnual.objetivo) * 100;

  const lecturaReciente = [
    { dia: 'Hoy', libro: 'Atomic Habits', paginas: 45 },
    { dia: 'Ayer', libro: 'Deep Work', paginas: 20 },
  ];

  return (
    <div className="biblioteca-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Mis Libros</h1>
        </div>
        <p>Gestiona tu biblioteca personal y progreso de lectura</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card challenge-card">
          <div className="stat-icon-circle">
            <Trophy color="#ff6b35" size={24} />
          </div>
          <div className="stat-info">
            <h3>Desafío 2026</h3>
            <p>{retoAnual.leidos} de {retoAnual.objetivo} libros leídos</p>
            <div className="progress-bar-large">
              <div className="progress-fill" style={{ width: `${porcentajeReto}%` }}></div>
            </div>
          </div>
          <span className="stat-percent">{Math.round(porcentajeReto)}%</span>
        </div>

        <div className="stat-card">
          <div className="stat-icon-circle">
            <CheckCircle color="#ff6b35" size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Leídos</h3>
            <p className="big-number">148</p>
          </div>
        </div>
      </div>

      <div className="main-content-grid">
        <section className="activity-section">
          <div className="section-head">
            <h3>Actividad reciente</h3>
            <CalendarIcon size={20} color="#bbb" />
          </div>
          <div className="activity-list">
            {lecturaReciente.map((log, index) => (
              <div key={index} className="activity-item">
                <div className="activity-date"><span>{log.dia}</span></div>
                <div className="activity-detail">
                  <strong>{log.libro}</strong>
                  <span>{log.paginas} páginas leídas</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lists-section">
          <div className="list-tabs">
            {['leyendo', 'leídos', 'por leer'].map((tab) => (
              <button 
                key={tab}
                className={`tab ${tabActiva === tab ? 'active' : ''}`}
                onClick={() => setTabActiva(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="books-mini-grid">
            {/* 2. Renderizado dinámico basado en la pestaña activa */}
            {misLibrosData[tabActiva].map((book) => (
              <div key={book.id} className="book-item-horizontal">
                <img src={book.img} alt={book.title} />
                <div className="book-item-info">
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {/* Cambiamos el icono según el estado */}
                    {tabActiva === 'leídos' ? 
                      <CheckCircle size={16} color="#4caf50" /> : 
                      <BookOpen size={16} color="#ff6b35" />
                    }
                    <h4>{book.title}</h4>
                  </div>
                  <p>{book.author}</p>
                  
                  {/* Solo mostramos progreso si no es "por leer" */}
                  {tabActiva !== 'por leer' && (
                    <div className="mini-progress">
                      <div className="progress-bar-small">
                        <div className="fill" style={{width: `${book.progress}%`}}></div>
                      </div>
                      <span>{book.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button className="add-book-btn">
              <Plus size={24} />
              <span>Añadir libro</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}