import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus, ArrowLeft, X } from 'lucide-react';
import './Favoritos.css';

export default function Favoritos() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);

  // Datos de ejemplo de libros favoritos
  const favoritos = [
    { 
      id: 1, 
      title: "The Alchemist", 
      author: "Paulo Coelho", 
      rating: 4.7, 
      img: "https://m.media-amazon.com/images/I/71aFt4+OTzL.jpg",
      sinopsis: "Un relato inspirador sobre seguir tus sueños y escuchar a tu corazón.",
      comentarios: ["Un clásico inspirador.", "Lectura obligatoria."]
    },
    { 
      id: 2, 
      title: "Atomic Habits", 
      author: "James Clear", 
      rating: 4.9, 
      img: "https://m.media-amazon.com/images/I/81wgcwbW6UL.jpg",
      sinopsis: "Una guía extremadamente práctica para romper malos hábitos y crear buenos.",
      comentarios: ["¡Increíble libro!", "Muy recomendado."]
    }
  ];

  return (
    <div className="favoritos-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Favoritos</h1>
        </div>
        <p>Tus historias y autores preferidos en un solo lugar</p>
      </header>

      <div className="reco-grid">
        {favoritos.length > 0 ? (
          favoritos.map((book) => (
            <div key={book.id} className="reco-card" onClick={() => setSelectedBook(book)}>
              <div className="reco-img-wrapper">
                <img src={book.img} alt={book.title} />
                <div className="reco-hover-actions">
                  <button className="reco-icon-btn active" onClick={(e) => e.stopPropagation()}>
                    <Heart size={18} fill="#ff6b35" />
                  </button>
                  <button className="reco-icon-btn" onClick={(e) => e.stopPropagation()}>
                    <BookmarkPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="reco-info">
                <div className="reco-rating">
                  <Star size={14} fill="#ff6b35" color="#ff6b35" />
                  <span>{book.rating}</span>
                </div>
                <h4>{book.title}</h4>
                <p>{book.author}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Heart size={48} color="#eee" />
            <p>Aún no has añadido libros a tus favoritos</p>
          </div>
        )}
      </div>

      {/* MODAL DE DETALLE (Misma lógica que Recomendaciones) */}
      {selectedBook && (
        <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedBook(null)}>
              <X size={24} />
            </button>
            <div className="modal-body">
              <img src={selectedBook.img} alt={selectedBook.title} className="modal-img" />
              <div className="modal-details">
                <div className="reco-rating">
                  <Star size={18} fill="#ff6b35" color="#ff6b35" />
                  <span style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{selectedBook.rating}</span>
                </div>
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">de {selectedBook.author}</p>
                <div className="modal-section">
                  <h3 className="modal-label">Sinopsis</h3>
                  <p className="modal-text">{selectedBook.sinopsis}</p>
                </div>
                <div className="modal-section">
                  <h3 className="modal-label">Comentarios</h3>
                  <div className="comments-list">
                    {selectedBook.comentarios?.map((c, i) => (
                      <div key={i} className="comment-pill">{c}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}