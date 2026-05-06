import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus, ArrowLeft, X } from 'lucide-react';
import './Recomendaciones.css';

export default function Recomendaciones() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    { 
      id: 1, 
      title: "Atomic Habits", 
      author: "James Clear", 
      rating: 4.9, 
      img: "https://m.media-amazon.com/images/I/81wgcwbW6UL.jpg",
      sinopsis: "Una guía extremadamente práctica y útil para romper malos hábitos y crear buenos. James Clear explica cómo los cambios minúsculos pueden conducir a resultados notables.",
      comentarios: ["¡Increíble libro!", "Cambió mi forma de ver el día a día.", "Muy recomendado para todos."]
    },
    { 
      id: 2, 
      title: "Deep Work", 
      author: "Cal Newport", 
      rating: 4.8, 
      img: "https://m.media-amazon.com/images/I/417P969h7uL.jpg",
      sinopsis: "Deep Work propone que la capacidad de concentrarse sin distracciones es una superpotencia en la economía moderna.",
      comentarios: ["Esencial para profesionales.", "Me ayudó a organizarme."]
    },
    { 
      id: 3, 
      title: "The Alchemist", 
      author: "Paulo Coelho", 
      rating: 4.7, 
      img: "https://m.media-amazon.com/images/I/71aFt4+OTzL.jpg",
      sinopsis: "Un relato inspirador sobre seguir tus sueños y escuchar a tu corazón.",
      comentarios: ["Un clásico inspirador.", "Lectura obligatoria."]
    },
    { 
      id: 4, 
      title: "Zero to One", 
      author: "Peter Thiel", 
      rating: 4.8, 
      img: "https://m.media-amazon.com/images/I/71uAI28RwFL.jpg",
      sinopsis: "Cómo construir empresas que crean cosas nuevas, pasando de 0 a 1.",
      comentarios: ["Mente abierta para negocios.", "Diferente a otros libros de startups."]
    }
  ];

  return (
    <div className="reco-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Recomendaciones</h1>
        </div>
        <p>Libros seleccionados especialmente para ti</p>
      </header>

      <div className="reco-grid">
        {books.map((book) => (
          <div key={book.id} className="reco-card" onClick={() => setSelectedBook(book)}>
            <div className="reco-img-wrapper">
              <img src={book.img} alt={book.title} />
              <div className="reco-hover-actions">
                <button className="reco-icon-btn" onClick={(e) => { e.stopPropagation(); }}>
                  <Heart size={18} />
                </button>
                <button className="reco-icon-btn" onClick={(e) => { e.stopPropagation(); }}>
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
        ))}
      </div>

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
                <p className="modal-author">{selectedBook.author}</p>
                
                <div className="modal-section">
                  <h3 className="modal-label">Sinopsis</h3>
                  <p className="modal-text">{selectedBook.sinopsis || "Sinopsis no disponible."}</p>
                </div>

                <div className="modal-section">
                  <h3 className="modal-label">Comentarios</h3>
                  <div className="comments-list">
                    {selectedBook.comentarios?.map((c, i) => (
                      <div key={i} className="comment-pill">{c}</div>
                    ))}
                  </div>
                </div>
                <button className="add-to-library-btn">Añadir a mi biblioteca</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}