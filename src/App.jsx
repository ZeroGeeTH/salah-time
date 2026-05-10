import React, { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: input.trim(), done: false }
      ]);
      setInput("");
    }
  };

  const handleToggle = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>Nemo Todo 2</h1>
      <form onSubmit={handleAdd} className="todo-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new todo"
          className="todo-input"
        />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.length === 0 && <li>No todos yet!</li>}
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <span
              onClick={() => handleToggle(todo.id)}
              style={{ cursor: 'pointer', marginRight: 8 }}
            >
              {todo.done ? "✔️" : "⭕"} {todo.text}
            </span>
            <button onClick={() => handleDelete(todo.id)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
