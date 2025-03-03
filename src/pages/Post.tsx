import React, { useEffect, useState } from 'react';
import { Post, postAPI } from '../services/api';
import { ItemList } from '../components/ItemList';
import { ItemForm } from '../components/ItemForm';

const initialPostState: Partial<Post> = {
  title: '',
  body: '',
  userId: 1,
  tags: []
};

const PostPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const fetchedPosts = await postAPI.getAll();
    setPosts(fetchedPosts);
    setIsLoading(false);
  };

  const handleCreatePost = () => {
    setEditingPost(initialPostState);
    setIsFormVisible(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsFormVisible(true);
  };

  const handleDeletePost = async (post: Post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      const success = await postAPI.delete(post.id);
      if (success) {
        setPosts(prev => prev.filter(p => p.id !== post.id));
      }
    }
  };

  const handleSubmitPost = async (post: Partial<Post>) => {
    try {
      if (post.id) {
        const updatedPost = await postAPI.update(post.id, post);
        if (updatedPost) {
          setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
        }
      } else {
        const newPost = await postAPI.create(post as Omit<Post, 'id'>);
        if (newPost) {
          setPosts(prev => [...prev, newPost]);
        }
      }
      setIsFormVisible(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const renderPostItem = (post: Post) => (
    <>
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="text-gray-600 mt-2">{post.body}</p>
      <div className="mt-2 text-sm">
        <span className="text-blue-500">
          {post.tags?.map(tag => `#${tag}`).join(' ')}
        </span>
      </div>
    </>
  );

  const renderPostFormFields = (post: Partial<Post>, handleChange: (field: keyof Post, value: any) => void) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={post.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          value={post.body || ''}
          onChange={(e) => handleChange('body', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
        <input
          type="text"
          value={post.tags?.join(', ') || ''}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <button
          onClick={handleCreatePost}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add New Post
        </button>
      </div>

      {isFormVisible ? (
        <ItemForm<Post>
          initialItem={editingPost || initialPostState}
          onSubmit={handleSubmitPost}
          onCancel={() => setIsFormVisible(false)}
          renderFormFields={renderPostFormFields}
          title={editingPost?.id ? 'Edit Post' : 'Create New Post'}
        />
      ) : (
        <ItemList<Post>
          items={posts}
          renderItem={renderPostItem}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          title="All Posts"
        />
      )}
    </div>
  );
};

export default PostPage;