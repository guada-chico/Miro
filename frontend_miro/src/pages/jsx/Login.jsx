import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Mail, Lock, User } from 'lucide-react' 
import { login, register } from '../../services/auth-service'
import { getValidToken } from '../../services/api-config' 
import '../css/Login.css'

// 1. Importamos tu logo (ajusta la ruta según tu estructura de carpetas)
import logoMiro from '../../assets/logo_miro_sf.png' 

export default function Login({ setToken }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const navigate = useNavigate()

  // Bloqueamos el scroll solo en esta página para que se vea como una App
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mostramos loading
    Swal.fire({
      title: 'Procesando...',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    if (isRegister) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Miro',
          text: 'Las contraseñas no coinciden',
          confirmButtonColor: '#4f46e5'
        })
        return
      }

      try {
        await register(name, email, password)
        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido a Miro!',
          text: 'Cuenta creada. Ya puedes entrar.',
          confirmButtonColor: '#4f46e5'
        }).then(() => {
          setIsRegister(false);
          // Opcional: limpiar campos
          setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
        })
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: err.message,
          confirmButtonColor: '#4f46e5'
        })
      }

    } else {
      try {
        await login(email, password)
        const token = getValidToken()
        setToken(token)

        Swal.fire({
          icon: 'success',
          title: 'Hola de nuevo',
          text: 'Entrando en tu biblioteca...',
          timer: 1500,
          showConfirmButton: false
        }).then(() => navigate('/inicio')) // Redirigimos a inicio

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Credenciales incorrectas',
          confirmButtonColor: '#4f46e5'
        })
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          {/* 2. Mostramos tu logo aquí en lugar del icono */}
          <div className="logo-container">
            <img src={logoMiro} alt="Miro Logo" className="logo-img" />
          </div>
          <h1>Miro</h1>
          <p>{isRegister ? 'Crea tu biblioteca personal' : 'Tu mundo de libros te espera'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-box">
              <User className="icon" size={20} />
              <input
                type="text"
                placeholder="Nombre completo"
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
              placeholder="Correo electrónico"
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
          <p>
            {isRegister ? '¿Ya eres lector de Miro?' : '¿Aún no tienes cuenta?'}
            <button type="button" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Inicia sesión' : 'Únete ahora'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}