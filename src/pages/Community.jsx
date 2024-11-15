import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function Community() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'https://via.placeholder.com/40',
      content: 'Just completed my first week of meal tracking! Down 2 pounds! 💪',
      likes: 24,
      comments: 8,
      time: '2h ago',
      image: null,
    },
    {
      id: 2,
      user: 'Mike R.',
      avatar: 'https://via.placeholder.com/40',
      content: 'Anyone have good high-protein vegetarian recipes to share?',
      likes: 15,
      comments: 12,
      time: '4h ago',
      image: null,
    },
  ]);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    image: null,
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;

    const post = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://via.placeholder.com/40',
      content: newPost.content,
      likes: 0,
      comments: 0,
      time: 'Just now',
      image: newPost.image,
    };

    setPosts([post, ...posts]);
    setNewPost({ content: '', image: null });
    setShowCreatePost(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community</h2>
        <button 
          onClick={() => setShowCreatePost(true)}
          className="btn btn-primary"
        >
          Create Post
        </button>
      </div>

      {showCreatePost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create Post</h3>
              <button 
                onClick={() => setShowCreatePost(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind?"
                className="w-full h-32 p-3 border rounded-lg resize-none"
                required
              />

              {newPost.image && (
                <div className="relative">
                  <img
                    src={newPost.image}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setNewPost({ ...newPost, image: null })}
                    className="absolute top-2 right-2 bg-white rounded-full p-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <label className="cursor-pointer text-primary hover:text-primary/80">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  📷 Add Photo
                </label>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreatePost(false)}
                  className="btn bg-gray-200 hover:bg-gray-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={post.avatar}
                alt={post.user}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-semibold">{post.user}</div>
                <div className="text-sm text-gray-600">{post.time}</div>
              </div>
            </div>

            <p className="mb-4">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <button 
                className="flex items-center space-x-1 hover:text-primary transition-colors"
                onClick={() => handleLike(post.id)}
              >
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                <span>💬</span>
                <span>{post.comments}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;