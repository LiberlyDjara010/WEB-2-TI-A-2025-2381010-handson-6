import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        setTodos(data.slice(0, 10)); // Limiting to first 10 todos for better performance
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newTodoItem: Todo = {
      id: todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1,
      title: newTodo,
      completed: false,
      userId: 1, // Default userId
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
  };

  const toggleComplete = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#7f8c8d' }}>Loading todos...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#e74c3c' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>My Todo List</h1>
      </div>
      
      <div style={{ display: 'flex', marginBottom: '20px', gap: '10px' }}>
        <input
          type="text"
          style={{ flexGrow: 1, padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button 
          style={{ 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '10px 15px', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }} 
          onClick={handleAddTodo}
        >
          Add Todo
        </button>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li 
            key={todo.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '15px', 
              borderRadius: '4px', 
              marginBottom: '10px', 
              backgroundColor: todo.completed ? '#f0f7f4' : '#f8f9fa', 
              borderLeft: `5px solid ${todo.completed ? '#27ae60' : '#3498db'}`,
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <input
              type="checkbox"
              style={{ marginRight: '15px', height: '20px', width: '20px', cursor: 'pointer' }}
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
            />
            <span style={{ 
              flexGrow: 1, 
              fontSize: '18px', 
              color: todo.completed ? '#7f8c8d' : '#34495e',
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}>
              {todo.title}
            </span>
            <button 
              style={{ 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                padding: '5px 10px', 
                cursor: 'pointer', 
                fontWeight: 'bold' 
              }}
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '20px', textAlign: 'right', color: '#7f8c8d', fontStyle: 'italic' }}>
        {todos.length} todos • {todos.filter(todo => todo.completed).length} completed
      </div>
    </div>
  );
};

export default Todos;