import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resposta = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', resposta.data.token)
      navigate('/board')
    } catch (err) {
      setErro('Email ou senha incorretos')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">📚</div>
          <span className="auth-logo-name">MyRoom</span>
        </div>

        <h1>Bem-vindo de volta</h1>
        <p className="auth-subtitle">Entre na sua conta para continuar</p>

        {erro && <div className="auth-erro">{erro}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-primary" type="submit">Entrar</button>
        </form>

        <div className="auth-footer">
          Não tem conta? <a href="/register">Cadastre-se</a>
        </div>
      </div>
    </div>
  )
}

export default Login