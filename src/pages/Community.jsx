function Community() {
  const posts = [
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'https://via.placeholder.com/40',
      content: 'Just completed my first week of meal tracking! Down 2 pounds! 💪',
      likes: 24,
      comments: 8,
      time: '2h ago',
    },
    {
      id: 2,
      user: 'Mike R.',
      avatar: 'https://via.placeholder.com/40',
      content: 'Anyone have good high-protein vegetarian recipes to share?',
      likes: 15,
      comments: 12,
      time: '4h ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community</h2>
        <button className="btn btn-primary">Create Post</button>
      </div>

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

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <button className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1">
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
export default Community; // Make sure to export the Auth component as default