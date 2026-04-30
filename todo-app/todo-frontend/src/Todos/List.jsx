import React from 'react'
import Todo from "./Todo.jsx";

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos.map((todo, index) => (
        <div key={todo._id}>
          <Todo
            todo={todo}
            onClickDelete={deleteTodo}
            onClickComplete={completeTodo}
          />
          {index < todos.length - 1 && <hr />}
        </div>
      ))}
    </>
  )
}

export default TodoList
