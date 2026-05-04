import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Mail, Lock, User } from 'lucide-react';
import { login, register } from '../../services/auth-service';
import './Login.css';
import logoMiro from '../../assets/logo_miro_sf.png';

export default function Login({ setToken }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Cargando Miro...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    if (isRegister) {
      if (password !== confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden' });
        return;
      }
      try {
        await register(name, email, password);
        Swal.fire({ icon: 'success', title: '¡Registro éxito!', text: 'Ya puedes entrar' });
        setIsRegister(false);
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      }
    } else {
      try {
        const data = await login(email, password);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        Swal.fire({ icon: 'success', title: 'Bienvenido', timer: 1500, showConfirmButton: false });
        navigate('/inicio');
      } catch (_) { 
  Swal.fire({ icon: 'error', title: 'Error', text: 'Algo salió mal' });
}
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src={logoMiro} alt="Miro Logo" className="logo-img" />
          <h1>Miro</h1>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-box">
              <User className="icon" size={20} />
              <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-box">
            <Mail className="icon" size={20} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-box">
            <Lock className="icon" size={20} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {isRegister && (
            <div className="input-box">
              <Lock className="icon" size={20} />
              <input type="password" placeholder="Confirmar" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}
          <button type="submit" className="main-btn">{isRegister ? 'Registrarse' : 'Entrar'}</button>
        </form>
        <div className="login-switch">
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}