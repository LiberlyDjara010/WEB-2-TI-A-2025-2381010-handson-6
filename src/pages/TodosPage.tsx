import React, { useEffect, useState } from 'react';
import { Todo, todoAPI } from '../services/api';
import { ItemList } from '../components/ItemList';
import { ItemForm } from '../components/ItemForm';

const initialTodoState: Partial<Todo> = {
  todo: '',
  completed: false,
  userId: 1
};

const TodosPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Partial<Todo> | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    const fetchedTodos = await todoAPI.getAll();
    setTodos(fetchedTodos);
    setIsLoading(false);
  };

  const handleCreateTodo = () => {
    setEditingTodo(initialTodoState);
    setIsFormVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setIsFormVisible(true);
  };

  const handleDeleteTodo = async (todo: Todo) => {
    if (window.confirm(`Are you sure you want to delete this todo?`)) {
      const success = await todoAPI.delete(todo.id);
      if (success) {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
      }
    }
  };

  const handleSubmitTodo = async (todo: Partial<Todo>) => {
    try {
      if (todo.id) {
        const updatedTodo = await todoAPI.update(todo.id, todo);
        if (updatedTodo) {
          setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
        }
      } else {
        const newTodo = await todoAPI.create(todo as Omit<Todo, 'id'>);
        if (newTodo) {
          setTodos(prev => [...prev, newTodo]);
        }
      }
      setIsFormVisible(false);
      setEditingTodo(null);
    } catch (error) {
      console.error('Error saving todo:', error);
    }
  };

  const toggleTodoCompletion = async (todo: Todo) => {
    try {
      const updatedTodo = await todoAPI.update(todo.id, { completed: !todo.completed });
      if (updatedTodo) {
        setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
      }
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const renderTodoItem = (todo: Todo) => (
    <>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodoCompletion(todo)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <h3 className={`ml-3 text-lg ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.todo}
        </h3>
      </div>
      <p className="text-sm text-gray-500 mt-2">User ID: {todo.userId}</p>
    </>
  );

  const renderTodoFormFields = (todo: Partial<Todo>, handleChange: (field: keyof Todo, value: any) => void) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Task</label>
        <input
          type="text"
          value={todo.todo || ''}
          onChange={(e) => handleChange('todo', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="completed"
          checked={todo.completed || false}
          onChange={(e) => handleChange('completed', e.target.checked)}
          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
          Completed
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">User ID</label>
        <input
          type="number"
          value={todo.userId || 1}
          onChange={(e) => handleChange('userId', parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          required
        />
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading todos...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Todos</h1>
        <button
          onClick={handleCreateTodo}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Todo
        </button>
      </div>

      {isFormVisible ? (
        <ItemForm<Todo>
          initialItem={editingTodo || initialTodoState}
          onSubmit={handleSubmitTodo}
          onCancel={() => setIsFormVisible(false)}
          renderFormFields={renderTodoFormFields}
          title={editingTodo?.id ? 'Edit Todo' : 'Create New Todo'}
        />
      ) : (
        <ItemList<Todo>
          items={todos}
          renderItem={renderTodoItem}
          onEdit={handleEditTodo}
          onDelete={handleDeleteTodo}
          title="All Todos"
        />
      )}
    </div>
  );
};

export default TodosPage;