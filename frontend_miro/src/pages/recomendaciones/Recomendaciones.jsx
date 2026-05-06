import { useNavigate } from 'react-router-dom';
import { Star, Heart, BookmarkPlus, ArrowLeft } from 'lucide-react';
import './Recomendaciones.css';

export default function Recomendaciones() {
  const navigate = useNavigate();

  const books = [
    { id: 1, title: "Atomic Habits", author: "James Clear", rating: 4.9, img: "https://m.media-amazon.com/images/I/81wgcwbW6UL.jpg" },
    { id: 2, title: "Deep Work", author: "Cal Newport", rating: 4.8, img: "https://m.media-amazon.com/images/I/417P969h7uL.jpg" },
    { id: 3, title: "The Alchemist", author: "Paulo Coelho", rating: 4.7, img: "https://m.media-amazon.com/images/I/71aFt4+OTzL.jpg" },
    { id: 4, title: "Zero to One", author: "Peter Thiel", rating: 4.8, img: "https://m.media-amazon.com/images/I/71uAI28RwFL.jpg" },
    { id: 5, title: "The Psychology of Money", author: "Morgan Housel", rating: 4.8, img: "https://m.media-amazon.com/images/I/71TR7Z7N9RL.jpg" },
    { id: 6, title: "Think and Grow Rich", author: "Napoleon Hill", rating: 4.7, img: "https://m.media-amazon.com/images/I/71f6btvSv4L.jpg" },
    { id: 7, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", rating: 4.6, img: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg" },
    { id: 8, title: "Clean Code", author: "Robert C. Martin", rating: 4.8, img: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg" },
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
          <div key={book.id} className="reco-card">
            <div className="reco-img-wrapper">
              <img src={book.img} alt={book.title} />
              <div className="reco-hover-actions">
                <button className="reco-icon-btn"><Heart size={18} /></button>
                <button className="reco-icon-btn"><BookmarkPlus size={18} /></button>
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
    </div>
  );
}