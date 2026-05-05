import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Register.css'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setErro('As senhas não coincidem')
      return
    }

    try {
      const resposta = await api.post('/auth/register', { email, password })
      localStorage.setItem('token', resposta.data.token)
      navigate('/board')
    } catch (err) {
      setErro('Não foi possível cadastrar')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-icon">📚</div>
          <span className="auth-logo-name">MyRoom</span>
        </div>

        <h1>Crie sua conta</h1>
        <p className="auth-subtitle">Organize sua leitura em um só lugar</p>

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
          <input
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className="btn-primary" type="submit">Cadastrar</button>
        </form>

        <div className="auth-footer">
          Já tem conta? <a href="/login">Entrar</a>
        </div>
      </div>
    </div>
  )
}

export default Register