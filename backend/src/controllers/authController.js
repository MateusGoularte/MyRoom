const pool = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { email, password } = req.body

  try {
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (userExists.rows.length > 0) {
      return res.status(400).json({ mensagem: 'Email já cadastrado' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    )

    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({ token, user: newUser.rows[0] })

  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (user.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' })
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password)

    if (!validPassword) {
      return res.status(401).json({ mensagem: 'Senha incorreta' })
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({ token, user: { id: user.rows[0].id, email: user.rows[0].email } })

  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

module.exports = { register, login }