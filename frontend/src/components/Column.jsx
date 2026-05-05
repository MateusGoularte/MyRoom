import { Droppable } from '@hello-pangea/dnd'
import BookCard from './BookCard'
import './Column.css'

function Column({ titulo, livros, onDeletar, droppableId }) {
  return (
    <div className="column">
      <div className="column-header">
        <span className="column-title">{titulo}</span>
        <span className="column-count">{livros.length}</span>
      </div>

      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            className={`column-cards ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {livros.length === 0 && !snapshot.isDraggingOver && (
              <p className="column-empty">Nenhum livro aqui</p>
            )}
            {livros.map((livro, index) => (
              <BookCard
                key={livro.id}
                livro={livro}
                index={index}
                onDeletar={onDeletar}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default Column