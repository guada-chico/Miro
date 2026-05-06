import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-content">
      {/* SECCIÓN HERO Y BUSCADOR */}
      <section className="hero">
        <h1>Inicio</h1>
        <div className="search-capsule">
          <div className="search-cat">
            Todas las categorías <ChevronDown size={14} />
          </div>
          <div className="search-input">
            <Search size={18} color="#999" />
            <input type="text" placeholder="Encuentra el libro que quieres..." />
          </div>
          <button className="search-btn">Buscar</button>
        </div>
      </section>

      {/* SECCIÓN: CONTINUAR LEYENDO */}
      <section className="reading-now-section">
        <div className="section-head">
          <h3>Continuar leyendo</h3>
        </div>
        <div className="reading-card">
          <div className="reading-cover-container">
            <img 
              src="https://m.media-amazon.com/images/I/819js3EQ76L.jpg" 
              alt="The Picture of Dorian Gray" 
              className="reading-cover" 
            />
          </div>
          <div className="reading-info">
            <h4>The Picture of Dorian Gray</h4>
            <p className="author">Oscar Wilde</p>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-text">75% completado</span>
            </div>
            <button className="continue-btn">Continuar</button>
          </div>
        </div>
      </section>

      {/* SECCIÓN: LIBROS RECOMENDADOS */}
      <section className="books-section">
        <div className="section-head">
          <h3>Libros recomendados</h3>
          {/* Usamos un span con onClick para no romper el CSS con etiquetas <a> */}
          <span 
            className="orange-link" 
            onClick={() => navigate('/recomendaciones')}
            style={{ cursor: 'pointer' }}
          >
            Ver todos &gt;
          </span>
        </div>
        <div className="books-grid">
          <div className="book-card">
            <img src="https://m.media-amazon.com/images/I/71HkvkI29kL.jpg" alt="Libro 1" />
          </div>
          <div className="book-card">
            <img src="https://m.media-amazon.com/images/I/71HkvkI29kL.jpg" alt="Libro 2" />
          </div>
          <div className="book-card">
            <img src="https://m.media-amazon.com/images/I/71HkvkI29kL.jpg" alt="Libro 3" />
          </div>
          <div className="book-card">
            <img src="https://m.media-amazon.com/images/I/71HkvkI29kL.jpg" alt="Libro 4" />
          </div>
        </div>
      </section>
    </div>
  );
}