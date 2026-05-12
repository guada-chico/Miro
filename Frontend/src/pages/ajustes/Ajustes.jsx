import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Moon, Bell, Eye, ShieldCheck, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSettings } from '../../context/SettingsContext';
import { deleteAccount } from '../../services/profile-service';
import { logout } from '../../services/auth-service';
import { getT } from '../../i18n';
import './Ajustes.css';

export default function Ajustes() {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();
  const t = getT(settings.language).settings;

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: t.confirmTitle,
      text: t.confirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff4d4d',
      cancelButtonColor: '#aaa',
      confirmButtonText: t.confirmBtn,
      cancelButtonText: t.cancelBtn,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAccount();
      await Swal.fire({
        title: t.deletedTitle,
        text: t.deletedText,
        icon: 'success',
        confirmButtonColor: '#ff6b35',
        timer: 2000,
        showConfirmButton: false,
      });
      logout();
      navigate('/login');
    } catch {
      Swal.fire({
        title: t.errorTitle,
        text: t.errorText,
        icon: 'error',
        confirmButtonColor: '#ff6b35',
      });
    }
  };

  return (
    <div className="ajustes-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>{t.title}</h1>
        </div>
        <p>{t.subtitle}</p>
      </header>

      <div className="ajustes-content">

        {/* APARIENCIA E IDIOMA */}
        <section className="ajustes-section">
          <div className="section-header">
            <Eye size={20} />
            <h3>{t.appearance}</h3>
          </div>

          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Moon size={18} /></div>
              <div>
                <strong>{t.darkMode}</strong>
                <p>{t.darkModeDesc}</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => updateSetting('darkMode', !settings.darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Globe size={18} /></div>
              <div>
                <strong>{t.language}</strong>
                <p>{t.languageDesc}</p>
              </div>
            </div>
            <select
              className="ajuste-select"
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </section>

        {/* NOTIFICACIONES */}
        <section className="ajustes-section">
          <div className="section-header">
            <Bell size={20} />
            <h3>{t.notifications}</h3>
          </div>

          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Bell size={18} /></div>
              <div>
                <strong>{t.emailNotif}</strong>
                <p>{t.emailNotifDesc}</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotif}
                onChange={() => updateSetting('emailNotif', !settings.emailNotif)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        {/* PRIVACIDAD Y CUENTA */}
        <section className="ajustes-section">
          <div className="section-header">
            <ShieldCheck size={20} />
            <h3>{t.privacy}</h3>
          </div>

          <div className="ajuste-item">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg"><Eye size={18} /></div>
              <div>
                <strong>{t.publicProfile}</strong>
                <p>{t.publicProfileDesc}</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.publicProfile}
                onChange={() => updateSetting('publicProfile', !settings.publicProfile)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="ajuste-item delete-action">
            <div className="ajuste-info">
              <div className="ajuste-icon-bg danger"><Trash2 size={18} /></div>
              <div>
                <strong>{t.deleteAccount}</strong>
                <p>{t.deleteAccountDesc}</p>
              </div>
            </div>
            <button className="btn-danger-outline" onClick={handleDeleteAccount}>
              {t.deleteBtn}
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
