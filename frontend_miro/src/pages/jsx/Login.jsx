import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import logoImg from '../../assets/logo_miro_sf.png'
import { login, register } from '../../Services/auth-service'
import { getValidToken } from '../../Services/api-config' 
import '../css/Login.css'

export default function Login({ setToken }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isRegister) {
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          confirmButtonColor: 'var(--miro-red)'
        })
        return
      }

      try {

        await register(email, password)
        
        Swal.fire({
          icon: 'success',
          title: 'Registro completado',
          text: 'Ahora puedes iniciar sesión',
          confirmButtonColor: 'var(--miro-red)'
        }).then(() => setIsRegister(false))
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: err.message,
          confirmButtonColor: 'var(--miro-red)'
        })
      }

    } else {
      try {
        await login(email, password)

        const token = getValidToken()
        setToken(token)

        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Sesión iniciada correctamente`,
          confirmButtonColor: 'var(--miro-red)'
        }).then(() => navigate('/'))

      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Usuario o contraseña incorrectos',
          confirmButtonColor: 'var(--miro-red)'
        })
      }
    }

    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="login-page">
      <div className="login-header">
        <img src={logoImg} alt="Miro Logo" />
      </div>

      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isRegister && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}

          <button type="submit">
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="login-switch">
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <button type="button" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Iniciar sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </div>
  )
}