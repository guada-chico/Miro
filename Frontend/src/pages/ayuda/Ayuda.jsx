import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, HelpCircle, MessageSquare, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { getT } from '../../i18n';
import './Ayuda.css';

export default function Ayuda() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const t = getT(settings.language).help;

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="ayuda-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>{t.title}</h1>
        </div>
        <p>{t.subtitle}</p>
      </header>

      <div className="ayuda-search-section">
        <div className="search-bar-ayuda">
          <Search size={20} color="#bbb" />
          <input type="text" placeholder={t.searchPlaceholder} />
        </div>
      </div>

      <div className="ayuda-grid">
        <section className="faq-section">
          <h3><HelpCircle size={22} color="#ff6b35" /> {t.faqTitle}</h3>
          <div className="faq-list">
            {t.faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <span>{faq.q}</span>
                  {activeIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <aside className="contact-sidebar">
          <div className="contact-card">
            <MessageSquare size={30} color="#ff6b35" />
            <h4>{t.liveChat}</h4>
            <p>{t.liveChatDesc}</p>
            <button className="contact-btn">{t.startChat}</button>
          </div>

          <div className="contact-card">
            <Mail size={30} color="#ff6b35" />
            <h4>{t.emailSupport}</h4>
            <p>{t.emailSupportDesc}</p>
            <button className="contact-btn secondary">{t.sendEmail}</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
