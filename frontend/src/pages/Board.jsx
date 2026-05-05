import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DragDropContext } from '@hello-pangea/dnd'
import api from '../services/api'
import Column from '../components/Column'
import './Board.css'

function Board() {
  const [livros, setLivros] = useState([])
  const [modalAberto, setModalAberto] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('quero_ler')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/books').then(res => setLivros(res.data))
  }, [])

  const onDragEnd = async (result) => {
    const { source, destination } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    const novoStatus = destination.droppableId

    setLivros(livros.map(livro =>
      livro.id === parseInt(result.draggableId)
        ? { ...livro, status: novoStatus }
        : livro
    ))

    await api.put(`/books/${result.draggableId}`, { status: novoStatus })
  }

  const deletarLivro = async (id) => {
    await api.delete(`/books/${id}`)
    setLivros(livros.filter(livro => livro.id !== id))
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const adicionarLivro = async (e) => {
    e.preventDefault()
    try {
      const resposta = await api.post('/books', { title, author, description, status })
      setLivros([...livros, resposta.data])
      setModalAberto(false)
      setTitle('')
      setAuthor('')
      setDescription('')
      setStatus('quero_ler')
    } catch (err) {
      console.log(err)
    }
  }

  const queroLer = livros.filter(livro => livro.status === 'quero_ler')
  const lendo = livros.filter(livro => livro.status === 'lendo')
  const lido = livros.filter(livro => livro.status === 'lido')

  return (
    <div className="board-container">
      <header className="board-header">
        <div className="board-header-left">
          <div className="board-logo-icon">📚</div>
          <span className="board-title">MyRoom</span>
        </div>
        <div className="board-header-right">
          <button className="btn-add" onClick={() => setModalAberto(true)}>
            + Adicionar livro
          </button>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar livro</h2>
              <button className="btn-close" onClick={() => setModalAberto(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={adicionarLivro}>
              <input
                type="text"
                placeholder="Título do livro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Autor (opcional)"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
              <textarea
                placeholder="Descrição (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="quero_ler">Quero ler</option>
                <option value="lendo">Lendo</option>
                <option value="lido">Lido</option>
              </select>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  Salvar livro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-columns">
          <Column
            titulo="Quero Ler"
            livros={queroLer}
            onDeletar={deletarLivro}
            droppableId="quero_ler"
          />
          <Column
            titulo="Lendo"
            livros={lendo}
            onDeletar={deletarLivro}
            droppableId="lendo"
          />
          <Column
            titulo="Lido"
            livros={lido}
            onDeletar={deletarLivro}
            droppableId="lido"
          />
        </div>
      </DragDropContext>
    </div>
  )
}

export default Board