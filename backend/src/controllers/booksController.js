const pool = require('../db')

const getBooks = async (req, res) => {
  const userId = req.userId

  try {
    const result = await pool.query(
      'SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    res.status(200).json(result.rows)
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

const createBook = async (req, res) => {
  const userId = req.userId
  const { title, author, description, status } = req.body

  try {
    const result = await pool.query(
      'INSERT INTO books (user_id, title, author, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, title, author, description, status]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

const updateBook = async (req, res) => {
  const userId = req.userId
  const bookId = req.params.id
  const { title, author, description, status } = req.body

  try {
    // monta apenas os campos que foram enviados
    const fields = []
    const values = []
    let count = 1

    if (title !== undefined) {
      fields.push(`title = $${count}`)
      values.push(title)
      count++
    }
    if (author !== undefined) {
      fields.push(`author = $${count}`)
      values.push(author)
      count++
    }
    if (description !== undefined) {
      fields.push(`description = $${count}`)
      values.push(description)
      count++
    }
    if (status !== undefined) {
      fields.push(`status = $${count}`)
      values.push(status)
      count++
    }

    if (fields.length === 0) {
      return res.status(400).json({ mensagem: 'Nenhum campo para atualizar' })
    }

    values.push(bookId)
    values.push(userId)

    const query = `
      UPDATE books 
      SET ${fields.join(', ')} 
      WHERE id = $${count} AND user_id = $${count + 1}
      RETURNING *
    `

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' })
    }

    res.status(200).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

const deleteBook = async (req, res) => {
  const userId = req.userId
  const bookId = req.params.id

  try {
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING *',
      [bookId, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' })
    }

    res.status(200).json({ mensagem: 'Livro deletado com sucesso' })
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no servidor', erro: err.message })
  }
}

module.exports = { getBooks, createBook, updateBook, deleteBook }
