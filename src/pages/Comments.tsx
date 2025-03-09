import React, { useEffect, useState } from 'react';

interface Comment {
  id: number;
  body: string;
  postId: number;
  user: {
    id: number;
    username: string;
  };
}

interface CommentsResponse {
  comments: Comment[];
  total: number;
  skip: number;
  limit: number;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newCommentBody, setNewCommentBody] = useState<string>('');
  const [newCommentPostId, setNewCommentPostId] = useState<string>('1');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editCommentBody, setEditCommentBody] = useState<string>('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://dummyjson.com/comments');
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data: CommentsResponse = await response.json();
      setComments(data.comments);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newCommentBody.trim()) return;
    
    try {
      const postId = parseInt(newCommentPostId) || 1;
      
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: newCommentBody,
          postId: postId,
          userId: 1, // Default user ID
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const newComment: Comment = await response.json();
      
      // In a real app, you would use the returned comment
      // For DummyJSON which doesn't actually add to a database,
      // we'll simulate adding it to our local state
      setComments([...comments, {
        ...newComment,
        id: Math.max(...comments.map(c => c.id), 0) + 1,
        user: { id: 1, username: 'currentuser' } // Mock user data
      }]);
      
      setNewCommentBody('');
      setNewCommentPostId('1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
    }
  };

  const deleteComment = async (id: number) => {
    try {
      const response = await fetch(`https://dummyjson.com/comments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // In a real app, you would remove the comment based on API response
      // For DummyJSON, we'll simulate deletion in our local state
      setComments(comments.filter(comment => comment.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment);
    setEditCommentBody(comment.body);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditCommentBody('');
  };

  const saveCommentEdit = async () => {
    if (!editingComment || !editCommentBody.trim()) return;
    
    try {
      const response = await fetch(`https://dummyjson.com/comments/${editingComment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: editCommentBody,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      
      // Update local state
      setComments(comments.map(c => 
        c.id === editingComment.id ? { ...c, body: editCommentBody } : c
      ));
      
      setEditingComment(null);
      setEditCommentBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update comment');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading comments...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px' }}>
        Error: {error}
        <button 
          onClick={() => { setError(null); fetchComments(); }}
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
      <h2 style={{ color: '#333', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Comments</h2>
      
      {/* Add Comment Form */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '20px',
        gap: '10px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Add New Comment</h3>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ width: '80px' }}>Post ID:</label>
          <input
            type="number"
            value={newCommentPostId}
            onChange={(e) => setNewCommentPostId(e.target.value)}
            min="1"
            style={{
              width: '80px',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <textarea
          value={newCommentBody}
          onChange={(e) => setNewCommentBody(e.target.value)}
          placeholder="Write your comment..."
          rows={3}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            resize: 'vertical'
          }}
        />
        
        <button
          onClick={addComment}
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-end'
          }}
        >
          Add Comment
        </button>
      </div>
      
      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {comments.map((comment) => (
          <div 
            key={comment.id}
            style={{ 
              padding: '15px', 
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            {editingComment && editingComment.id === comment.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <textarea
                  value={editCommentBody}
                  onChange={(e) => setEditCommentBody(e.target.value)}
                  rows={3}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={saveCommentEdit}
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
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#555'
                  }}>
                    @{comment.user.username}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => startEditing(comment)}
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
                      onClick={() => deleteComment(comment.id)}
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
                </div>
                <p style={{ 
                  margin: 0,
                  color: '#333',
                  lineHeight: '1.5'
                }}>
                  {comment.body}
                </p>
                <div style={{
                  fontSize: '12px',
                  color: '#888',
                  marginTop: '10px'
                }}>
                  Post ID: {comment.postId}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;