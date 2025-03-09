import React, { useState, useEffect } from 'react';

interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{name: string; email: string; body: string}>({
    name: '',
    email: '',
    body: ''
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/comments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        return response.json();
      })
      .then(data => {
        setComments(data.slice(0, 10)); // Limiting to first 10 comments for better display
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComment({
      ...newComment,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name || !newComment.email || !newComment.body) {
      alert('Please fill all fields');
      return;
    }
    
    const commentToAdd: Comment = {
      id: comments.length ? Math.max(...comments.map(comment => comment.id)) + 1 : 1,
      postId: 1, // Default postId
      ...newComment
    };
    
    setComments([commentToAdd, ...comments]);
    setNewComment({ name: '', email: '', body: '' });
  };

  const deleteComment = (id: number) => {
    setComments(comments.filter(comment => comment.id !== id));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#7f8c8d' }}>Loading comments...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#e74c3c' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '25px', textAlign: 'center', borderBottom: '2px solid #9b59b6', paddingBottom: '15px' }}>
        <h1 style={{ fontSize: '28px', color: '#2c3e50', margin: 0 }}>Discussion</h1>
      </div>
      
      <form 
        style={{ 
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '30px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' 
        }} 
        onSubmit={handleSubmit}
      >
        <div style={{ marginBottom: '15px' }}>
          <label 
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }} 
            htmlFor="name"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            value={newComment.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label 
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }} 
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            value={newComment.email}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            required
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label 
            style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#34495e' }} 
            htmlFor="body"
          >
            Comment
          </label>
          <textarea
            id="body"
            name="body"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              minHeight: '100px', 
              fontSize: '16px', 
              resize: 'vertical' 
            }}
            value={newComment.body}
            onChange={handleInputChange}
            placeholder="Share your thoughts..."
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            backgroundColor: '#9b59b6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            padding: '12px 20px', 
            fontSize: '16px', 
            cursor: 'pointer', 
            fontWeight: 'bold', 
            display: 'block', 
            width: '100%' 
          }}
        >
          Post Comment
        </button>
      </form>
      
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {comments.map(comment => (
          <li 
            key={comment.id} 
            style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '20px', 
              marginBottom: '20px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
              position: 'relative', 
              borderLeft: '5px solid #9b59b6' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <h3 style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '18px', margin: 0 }}>{comment.name}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', margin: '5px 0 0' }}>{comment.email}</p>
              </div>
              <button 
                style={{ 
                  backgroundColor: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  padding: '5px 10px', 
                  cursor: 'pointer', 
                  fontSize: '14px' 
                }}
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </button>
            </div>
            <p style={{ color: '#34495e', lineHeight: 1.6, marginTop: '10px' }}>{comment.body}</p>
          </li>
        ))}
      </ul>
      
      <div style={{ textAlign: 'right', marginTop: '20px', color: '#7f8c8d', fontStyle: 'italic' }}>
        {comments.length} comments
      </div>
    </div>
  );
};

export default Comments;