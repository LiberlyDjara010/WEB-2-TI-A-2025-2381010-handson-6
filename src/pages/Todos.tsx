import { useState, useEffect } from "react";
import axios from "axios";

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  
  // Form states
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [newTodo, setNewTodo] = useState<Partial<Todo>>({
    todo: "",
    completed: false,
    userId: 1,
  });

  // Fetch all todos
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://dummyjson.com/todos");
      setTodos(response.data.todos);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new todo
  const addTodo = async () => {
    try {
      const response = await axios.post("https://dummyjson.com/todos/add", {
        todo: newTodo.todo,
        completed: newTodo.completed,
        userId: newTodo.userId,
      });
      
      setTodos([...todos, response.data]);
      setShowAddModal(false);
      setNewTodo({ todo: "", completed: false, userId: 1 });
      
    } catch (err) {
      setError("Failed to add todo");
      console.error(err);
    }
  };

  // Update a todo
  const updateTodo = async () => {
    if (!selectedTodo) return;
    
    try {
      const response = await axios.put(`https://dummyjson.com/todos/${selectedTodo.id}`, {
        todo: selectedTodo.todo,
        completed: selectedTodo.completed,
      });
      
      setTodos(
        todos.map((todo) =>
          todo.id === selectedTodo.id ? response.data : todo
        )
      );
      
      setShowEditModal(false);
      
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
    }
  };

  // Delete a todo
  const deleteTodo = async () => {
    if (!selectedTodo) return;
    
    try {
      await axios.delete(`https://dummyjson.com/todos/${selectedTodo.id}`);
      
      setTodos(todos.filter((todo) => todo.id !== selectedTodo.id));
      setShowDeleteModal(false);
      
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (todo: Todo) => {
    try {
      const response = await axios.put(`https://dummyjson.com/todos/${todo.id}`, {
        completed: !todo.completed,
      });
      
      setTodos(
        todos.map((t) =>
          t.id === todo.id ? response.data : t
        )
      );
      
    } catch (err) {
      setError("Failed to update todo status");
      console.error(err);
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Modal handlers
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => setShowAddModal(true);
  
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowEditModal(true);
  };
  
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (todo: Todo) => {
    setSelectedTodo(todo);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading todos...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Todos</h2>
      <button className="btn btn-primary mb-3" onClick={handleShowAddModal}>
        Add New Todo
      </button>

      {/* Todos list */}
      <div className="row">
        {todos.map((todo) => (
          <div className="col-md-4 mb-3" key={todo.id}>
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      {todo.todo}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      User ID: {todo.userId}
                    </h6>
                  </div>
                  <span className={`badge ${todo.completed ? "bg-success" : "bg-warning"}`}>
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <button
                  className={`btn ${todo.completed ? "btn-outline-warning" : "btn-outline-success"} me-2 mt-2`}
                  onClick={() => toggleComplete(todo)}
                >
                  {todo.completed ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button
                  className="btn btn-warning me-2 mt-2"
                  onClick={() => handleShowEditModal(todo)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleShowDeleteModal(todo)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Todo Modal */}
      <div className={`modal ${showAddModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Todo</h5>
              <button type="button" className="btn-close" onClick={handleCloseAddModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Todo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTodo.todo}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, todo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="completedCheck"
                    checked={newTodo.completed}
                    onChange={(e) =>
                      setNewTodo({ ...newTodo, completed: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="completedCheck">Completed</label>
                </div>
                <div className="mb-3">
                  <label className="form-label">User ID</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newTodo.userId}
                    onChange={(e) =>
                      setNewTodo({
                        ...newTodo,
                        userId: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseAddModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addTodo}>
                Add Todo
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showAddModal ? 'show' : 'd-none'}`}></div>

      {/* Edit Todo Modal */}
      <div className={`modal ${showEditModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Todo</h5>
              <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Todo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedTodo?.todo || ""}
                    onChange={(e) =>
                      setSelectedTodo(
                        selectedTodo
                          ? { ...selectedTodo, todo: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="editCompletedCheck"
                    checked={selectedTodo?.completed || false}
                    onChange={(e) =>
                      setSelectedTodo(
                        selectedTodo
                          ? { ...selectedTodo, completed: e.target.checked }
                          : null
                      )
                    }
                  />
                  <label className="form-check-label" htmlFor="editCompletedCheck">Completed</label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseEditModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={updateTodo}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showEditModal ? 'show' : 'd-none'}`}></div>

      {/* Delete Todo Modal */}
      <div className={`modal ${showDeleteModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Delete Todo</h5>
              <button type="button" className="btn-close" onClick={handleCloseDeleteModal}></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this todo?
              <p className="mt-2 font-italic">"{selectedTodo?.todo}"</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={deleteTodo}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showDeleteModal ? 'show' : 'd-none'}`}></div>
    </div>
  );
}