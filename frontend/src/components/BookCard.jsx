import { Draggable } from '@hello-pangea/dnd'
import './BookCard.css'

function BookCard({ livro, index, onDeletar }) {
  return (
    <Draggable draggableId={String(livro.id)} index={index}>
      {(provided, snapshot) => (
        <div
          className={`book-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className="book-card-title">{livro.title}</p>
          {livro.author && <p className="book-card-author">{livro.author}</p>}
          {livro.description && (
            <p className="book-card-description">{livro.description}</p>
          )}
          <div className="book-card-footer">
            <button className="btn-delete" onClick={() => onDeletar(livro.id)}>
              Deletar
            </button>
          </div>
        </div>
      )}
    </Draggable>
  )
}

export default BookCard