import React, { useState, useEffect } from "react";
import axios from "axios";

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

interface Notification {
  message: string;
  type: 'success' | 'error' | null;
}

export default function CommentsManager() {
  // State management
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification>({message: '', type: null});
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  
  // Form states
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState<Partial<Comment>>({
    body: "",
    postId: 1,
  });
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commentsPerPage] = useState<number>(6);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Comment | 'user' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch all comments
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://dummyjson.com/comments?limit=100");
      setComments(response.data.comments);
      setError(null);
    } catch (err) {
      setError("Failed to fetch comments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new comment
  const addComment = async () => {
    if (!newComment.body?.trim()) {
      setNotification({message: "Comment cannot be empty", type: 'error'});
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post("https://dummyjson.com/comments/add", {
        body: newComment.body,
        postId: newComment.postId || 1,
        userId: 1, 
      });
      
      setComments([response.data, ...comments]);
      setShowAddModal(false);
      setNewComment({ body: "", postId: 1 });
      setNotification({message: "Comment added successfully!", type: 'success'});
      
    } catch (err) {
      setNotification({message: "Failed to add comment", type: 'error'});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update a comment
  const updateComment = async () => {
    if (!selectedComment) return;
    if (!selectedComment.body?.trim()) {
      setNotification({message: "Comment cannot be empty", type: 'error'});
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.put(`https://dummyjson.com/comments/${selectedComment.id}`, {
        body: selectedComment.body,
      });
      
      setComments(
        comments.map((comment) =>
          comment.id === selectedComment.id ? response.data : comment
        )
      );
      
      setShowEditModal(false);
      setNotification({message: "Comment updated successfully!", type: 'success'});
      
    } catch (err) {
      setNotification({message: "Failed to update comment", type: 'error'});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a comment
  const deleteComment = async () => {
    if (!selectedComment) return;
    
    try {
      setLoading(true);
      await axios.delete(`https://dummyjson.com/comments/${selectedComment.id}`);
      
      setComments(comments.filter((comment) => comment.id !== selectedComment.id));
      setShowDeleteModal(false);
      setNotification({message: "Comment deleted successfully!", type: 'success'});
      
    } catch (err) {
      setNotification({message: "Failed to delete comment", type: 'error'});
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sorting
  const handleSort = (field: keyof Comment | 'user') => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  // Filter and sort comments
  const getFilteredAndSortedComments = () => {
    let result = [...comments];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(comment => 
        comment.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    if (sortField) {
      result.sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'user') {
          aValue = a.user.username;
          bValue = b.user.username;
        } else {
          aValue = a[sortField as keyof Comment];
          bValue = b[sortField as keyof Comment];
        }
        
        if (typeof aValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue as string)
            : (bValue as string).localeCompare(aValue);
        }
        
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }
    
    return result;
  };

  // Get current comments for pagination
  const filteredAndSortedComments = getFilteredAndSortedComments();
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredAndSortedComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredAndSortedComments.length / commentsPerPage);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({message: '', type: null});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  // Modal handlers
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleShowAddModal = () => {
    setNewComment({ body: "", postId: 1 });
    setShowAddModal(true);
  };
  
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = (comment: Comment) => {
    setSelectedComment({...comment});
    setShowEditModal(true);
  };
  
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = (comment: Comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  // Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSortField(null);
    setSortDirection('asc');
    setCurrentPage(1);
  };

  // Random color generator for user avatars
  const getUserColor = (username: string) => {
    const colors = [
      "#4F46E5", "#10B981", "#F59E0B", "#EF4444", 
      "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"
    ];
    
    // Generate a consistent index for each username
    const index = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  // Get user avatar
  const getUserInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="container mt-4 pb-5">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="fw-bold text-primary mb-0">
            <i className="bi bi-chat-square-dots me-2"></i>Comments Manager
          </h2>
        </div>
        <div className="col-md-4 text-end">
          <button 
            className="btn btn-primary rounded-pill shadow-sm" 
            onClick={handleShowAddModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Comment
          </button>
        </div>
      </div>
      
      {/* Notification */}
      {notification.type && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show shadow-sm border-0`} role="alert">
          <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({message: '', type: null})}></button>
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search comments or users..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                {searchTerm && (
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="btn-group w-100" role="group">
                <button 
                  className={`btn ${sortField === 'id' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('id')}
                >
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`btn ${sortField === 'user' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('user')}
                >
                  User {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
                <button 
                  className={`btn ${sortField === 'postId' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('postId')}
                >
                  Post {sortField === 'postId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
          
          {(searchTerm || sortField) && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Found {filteredAndSortedComments.length} comments
              </small>
              <button 
                className="btn btn-sm btn-light"
                onClick={resetFilters}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading Indicator */}
      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && !loading && (
        <div className="alert alert-danger shadow-sm">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
            <div>
              <h5 className="mb-1">Error Loading Comments</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
          <button className="btn btn-danger mt-2" onClick={fetchComments}>
            <i className="bi bi-arrow-clockwise me-1"></i> Try Again
          </button>
        </div>
      )}
      
      {/* No Results */}
      {!loading && !error && filteredAndSortedComments.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center p-5">
            <i className="bi bi-search fs-1 text-muted mb-3"></i>
            <h4>No Comments Found</h4>
            <p className="mb-0">{searchTerm ? `No results found for "${searchTerm}"` : 'There are no comments to display.'}</p>
            {searchTerm && (
              <button className="btn btn-outline-primary mt-3" onClick={resetFilters}>
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Comments Grid */}
      {!loading && !error && filteredAndSortedComments.length > 0 && (
        <>
          <div className="row">
            {currentComments.map((comment) => (
              <div className="col-md-6 col-lg-4 mb-4" key={comment.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-white d-flex align-items-center border-0 pt-3 pb-0">
                    <div 
                      className="avatar rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: getUserColor(comment.user.username)
                      }}
                    >
                      {getUserInitials(comment.user.username)}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{comment.user.username}</h6>
                      <span className="text-muted small">Post #{comment.postId}</span>
                    </div>
                    <span className="ms-auto badge rounded-pill bg-light text-dark">
                      ID: {comment.id}
                    </span>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{comment.body}</p>
                  </div>
                  <div className="card-footer bg-white border-0 d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      onClick={() => handleShowEditModal(comment)}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => handleShowDeleteModal(comment)}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Comments pagination">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={prevPage}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1);
                    })
                    .map((page, index, array) => {
                      const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                      const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsisBefore && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                          <li className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => paginate(page)}
                            >
                              {page}
                            </button>
                          </li>
                          {showEllipsisAfter && (
                            <li className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          )}
                        </React.Fragment>
                      );
                    })}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={nextPage}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
          
          <div className="text-center mt-2 mb-4">
            <small className="text-muted">
              Showing {indexOfFirstComment + 1}-{Math.min(indexOfLastComment, filteredAndSortedComments.length)} of {filteredAndSortedComments.length} comments
            </small>
          </div>
        </>
      )}

      {/* Add Comment Modal */}
      <div className={`modal fade ${showAddModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-plus-circle me-2"></i>Add New Comment
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={handleCloseAddModal}></button>
            </div>
            <div className="modal-body p-4">
              <form>
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control border-0 bg-light"
                    rows={4}
                    value={newComment.body}
                    onChange={(e) =>
                      setNewComment({ ...newComment, body: e.target.value })
                    }
                    placeholder="Write your comment here..."
                  />
                  {!newComment.body?.trim() && (
                    <div className="form-text text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Comment cannot be empty
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <label className="form-label">Post ID</label>
                  <input
                    type="number"
                    className="form-control border-0 bg-light"
                    value={newComment.postId}
                    onChange={(e) =>
                      setNewComment({
                        ...newComment,
                        postId: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={handleCloseAddModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary px-4"
                onClick={addComment}
                disabled={!newComment.body?.trim()}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showAddModal ? 'show' : 'd-none'}`}></div>

      {/* Edit Comment Modal */}
      <div className={`modal fade ${showEditModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-pencil me-2"></i>Edit Comment
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={handleCloseEditModal}></button>
            </div>
            <div className="modal-body p-4">
              {selectedComment && (
                <form>
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="avatar rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: getUserColor(selectedComment.user.username)
                      }}
                    >
                      {getUserInitials(selectedComment.user.username)}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{selectedComment.user.username}</h6>
                      <span className="text-muted small">Post #{selectedComment.postId}</span>
                    </div>
                    <span className="ms-auto badge rounded-pill bg-light text-dark">
                      ID: {selectedComment.id}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control border-0 bg-light"
                      rows={4}
                      value={selectedComment.body}
                      onChange={(e) =>
                        setSelectedComment({
                          ...selectedComment,
                          body: e.target.value
                        })
                      }
                    />
                    {!selectedComment.body?.trim() && (
                      <div className="form-text text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Comment cannot be empty
                      </div>
                    )}
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={handleCloseEditModal}>
                Cancel
              </button>
              <button 
                className="btn btn-primary px-4"
                onClick={updateComment}
                disabled={!selectedComment?.body?.trim()}
              >
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={`modal-backdrop fade ${showEditModal ? 'show' : 'd-none'}`}></div>

      {/* Delete Comment Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show d-block' : 'd-none'}`} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-trash me-2"></i>Delete Comment
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={handleCloseDeleteModal}></button>
            </div>
            <div className="modal-body p-4">
              {selectedComment && (
                <>
                  <div className="alert alert-warning d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill fs-4 me-2"></i>
                    <div>
                      This action cannot be undone. Are you sure you want to delete this comment?
                    </div>
                  </div>
                  
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <div 
                          className="avatar rounded-circle d-flex align-items-center justify-content-center me-2 text-white fw-bold"
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            backgroundColor: getUserColor(selectedComment.user.username)
                          }}
                        >
                          {getUserInitials(selectedComment.user.username)}
                        </div>
                        <h6 className="mb-0 fw-bold">{selectedComment.user.username}</h6>
                        <span className="ms-auto badge rounded-pill bg-white text-dark">
                          ID: {selectedComment.id}
                        </span>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          <i className="bi bi-link-45deg me-1"></i>
                          Post #{selectedComment.postId}
                        </small>
                      </div>
                      <p className="mb-0">{selectedComment.body}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-light" onClick={handleCloseDeleteModal}>
                Cancel
              </button>
              <button className="btn btn-danger px-4" onClick={deleteComment}>
                <i className="bi bi-trash me-2"></i>
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