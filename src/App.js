import React, { useState, useEffect } from 'react';

function getStoredTodos() {
  const todos = localStorage.getItem('todos');
  if (!todos) return [];
  try {
    return JSON.parse(todos);
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState(getStoredTodos);
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input.trim(), done: false }
    ]);
    setInput('');
  };

  const toggleDone = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <div style={{maxWidth:'500px',margin:'2rem auto',padding:'2rem',border:'1px solid #ccc',borderRadius:'8px'}}>
      <h1>Todo List</h1>
      <form onSubmit={addTodo}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add new todo"
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{listStyle:'none',padding:'0'}}>
        {todos.map(todo => (
          <li key={todo.id} style={{margin:"1rem 0"}}>
            <label style={{display:'flex',alignItems:'center',cursor:'pointer'}}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleDone(todo.id)}
              />
              <span style={{marginLeft:'0.5rem', textDecoration: todo.done ? 'line-through' : 'none'}}>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
