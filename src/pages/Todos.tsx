import React, { useEffect, useState } from 'react';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodosResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data: TodosResponse = await response.json();
      setTodos(data.todos);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    
    try {
      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: newTodoText,
          completed: false,
          userId: 1, // Default user ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const newTodo: Todo = await response.json();
      
      // In a real app, you would use the returned todo
      // For DummyJSON which doesn't actually add to a database,
      // we'll simulate adding it to our local state
      setTodos([...todos, {
        ...newTodo,
        id: Math.max(...todos.map(t => t.id), 0) + 1
      }]);
      setNewTodoText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add todo');
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      // In a real app, you would remove the todo based on API response
      // For DummyJSON, we'll simulate deletion in our local state
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    }
  };

  const updateTodoStatus = async (todo: Todo) => {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !todo.completed,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }
      
      // Update local state
      setTodos(todos.map(t => 
        t.id === todo.id ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo status');
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.todo);
  };

  const cancelEditing = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const saveTodoEdit = async () => {
    if (!editingTodo || !editText.trim()) return;
    
    try {
      const response = await fetch(`https://dummyjson.com/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: editText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      // Update local state
      setTodos(todos.map(t => 
        t.id === editingTodo.id ? { ...t, todo: editText } : t
      ));
      
      setEditingTodo(null);
      setEditText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading todos...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        Error: {error}
        <button 
          onClick={() => { setError(null); fetchTodos(); }}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Todos</h2>
      
      {/* Add Todo Form */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px',
        gap: '10px' 
      }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo..."
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>
      
      {/* Todo List */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li 
            key={todo.id}
            style={{ 
              padding: '15px', 
              margin: '10px 0', 
              backgroundColor: todo.completed ? '#e6ffe6' : '#fff',
              border: '1px solid #ddd',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {editingTodo && editingTodo.id === todo.id ? (
              <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '10px' }}>
                <input 
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
                <button
                  onClick={saveTodoEdit}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={cancelEditing}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => updateTodoStatus(todo)} 
                    style={{ marginRight: '15px', cursor: 'pointer' }}
                  />
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#666' : '#333'
                  }}>
                    {todo.todo}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => startEditing(todo)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;