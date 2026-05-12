
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, Camera, Save, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { getProfile, updateProfile, changePassword, updateAvatar } from '../../services/profile-service';
import { logout } from '../../services/auth-service';
import './Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Datos del perfil
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Feedback
  const [profileMsg, setProfileMsg] = useState(null);   // { type: 'ok'|'error', text }
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [avatarMsg, setAvatarMsg] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Cargar perfil al montar
  useEffect(() => {
    getProfile()
      .then((data) => {
        setNombre(data.name);
        setCorreo(data.email);
        setAvatarUrl(data.avatarUrl);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Guardar datos personales ──────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setProfileMsg({ type: 'error', text: 'El nombre y el correo son obligatorios.' });
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile(nombre.trim(), correo.trim());
      setProfileMsg({ type: 'ok', text: 'Perfil actualizado correctamente.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data || 'Error al guardar los cambios.' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileMsg(null), 4000);
    }
  };

  // ── Cambiar contraseña ────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'Rellena todos los campos.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'ok', text: 'Contraseña actualizada correctamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data || 'Error al cambiar la contraseña.' });
    } finally {
      setSavingPassword(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  // ── Cambiar foto ──────────────────────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Previsualización inmediata
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result);
    reader.readAsDataURL(file);

    try {
      await updateAvatar(file);
      setAvatarMsg({ type: 'ok', text: 'Foto actualizada.' });
    } catch {
      setAvatarMsg({ type: 'error', text: 'Error al subir la foto.' });
    } finally {
      setTimeout(() => setAvatarMsg(null), 3000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Generar avatar por defecto con las iniciales
  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre || 'U')}&background=ff6b35&color=fff&size=150`;

  if (loading) {
    return (
      <div className="perfil-container">
        <p style={{ color: '#aaa', padding: '2rem' }}>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <header className="reco-header">
        <div className="reco-title-row">
          <button className="back-btn" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={20} />
          </button>
          <h1>Mi Perfil</h1>
        </div>
        <p>Gestiona tu información personal y ajustes de cuenta</p>
      </header>

      <div className="perfil-content">
        {/* SIDEBAR: FOTO Y RESUMEN */}
        <aside className="perfil-sidebar-info">
          <div className="avatar-wrapper">
            <img
              src={avatarUrl || defaultAvatar}
              alt="Avatar"
              className="perfil-avatar"
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <button
              className="change-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Cambiar foto"
            >
              <Camera size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          {avatarMsg && (
            <p style={{ fontSize: '0.8rem', color: avatarMsg.type === 'ok' ? '#4caf50' : '#e55a25', marginBottom: '0.5rem' }}>
              {avatarMsg.text}
            </p>
          )}

          <h2>{nombre || 'Usuario'}</h2>
          <p>{correo}</p>

          <button className="logout-perfil-btn" onClick={handleLogout}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </aside>

        {/* FORMULARIOS */}
        <div className="perfil-forms">

          {/* INFORMACIÓN PERSONAL */}
          <section className="perfil-card">
            <h3><User size={20} /> Información Personal</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Nombre</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Correo electrónico</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="tu@correo.com"
                  />
                </div>
              </div>

              {profileMsg && (
                <div className={`perfil-msg ${profileMsg.type}`}>
                  {profileMsg.type === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {profileMsg.text}
                </div>
              )}

              <button type="submit" className="save-btn" disabled={savingProfile}>
                <Save size={18} /> {savingProfile ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </section>

          {/* SEGURIDAD */}
          <section className="perfil-card">
            <h3><Lock size={20} /> Seguridad</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Contraseña actual</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                </div>
              </div>

              {passwordMsg && (
                <div className={`perfil-msg ${passwordMsg.type}`}>
                  {passwordMsg.type === 'ok' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  {passwordMsg.text}
                </div>
              )}

              <button type="submit" className="save-btn secondary" disabled={savingPassword}>
                {savingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
