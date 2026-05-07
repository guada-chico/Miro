import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Mail, Lock, User } from 'lucide-react';
import { login, register } from '../../services/auth-service'; 
import './Login.css';
import logoMiro from '../../assets/logo-miro-libro-sf.png';

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

  useEffect(() => {
    setConfirmPassword('');
  }, [isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegister) {
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
          Swal.fire({
            title: 'Error',
            text: 'Las contraseñas no coinciden',
            icon: 'error',
            confirmButtonText: 'Reintentar'
          });
          return;
        }

        // Llamar al servicio de registro
        await register(name, email, password);
        
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Ahora puedes iniciar sesión',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        
        // Cambiar a modo login
        setIsRegister(false);
        setName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Llamar al servicio de login
        await login(email, password);
        
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Acceso concedido',
          icon: 'success',
          confirmButtonText: 'Entrar',
          timer: 1500
        }).then(() => {
          navigate('/inicio');
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || error.message || 'Credenciales incorrectas',
        icon: 'error',
        confirmButtonText: 'Reintentar'
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src={logoMiro} alt="Miro Logo" className="logo-img" />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          
          {isRegister && (
            <div className="input-box">
              <User className="icon" size={20} />
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-box">
            <Mail className="icon" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <Lock className="icon" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="input-box">
              <Lock className="icon" size={20} />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="main-btn">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <div className="login-switch">
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    </div>
  );
}