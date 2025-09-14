import React, { useState } from 'react';
// FIX: Added .ts extension to import path
import type { Post as PostType, User } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { HeartIcon, CommentIcon, ShareIcon } from '../common/Icons.tsx';

interface PostProps {
  post: PostType;
  currentUser: User;
  onComment: (postId: string, text: string) => void;
  onLikeToggle: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
}

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CommentForm: React.FC<{
  currentUser: User;
  onSubmit: (text: string) => void;
}> = ({ currentUser, onSubmit }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onSubmit(commentText);
      setCommentText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 mt-4 px-4 pb-2">
      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="w-full bg-gray-800 rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        disabled={!commentText.trim()}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Reply
      </button>
    </form>
  );
};

export const Post: React.FC<PostProps> = ({ post, currentUser, onComment, onLikeToggle, onSharePost, onViewProfile }) => {
  const [showComments, setShowComments] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isLiked = post.likes.users.includes(currentUser.id);

  const handleLikeClick = () => {
    setIsAnimating(true);
    onLikeToggle(post.id);
    setTimeout(() => {
        setIsAnimating(false);
    }, 300); // Animation duration
  };
  
  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    onViewProfile(userId);
  };

  const displayUser = post.user;
  const originalPost = post.originalPost;

  return (
    <div className="border-b border-gray-700">
        {originalPost && (
            <div className="px-4 pt-3 text-sm text-gray-500 flex items-center space-x-2">
                <ShareIcon className="w-4 h-4" />
                <button onClick={(e) => handleProfileClick(e, displayUser.id)} className="font-semibold hover:underline">
                    {displayUser.name}
                </button>
                <span>shared</span>
            </div>
        )}
        <div className="p-4 flex space-x-4">
          <div className="flex-shrink-0">
            <button onClick={(e) => handleProfileClick(e, displayUser.id)} className="focus:outline-none">
              <img src={displayUser.avatarUrl} alt={displayUser.name} className="w-12 h-12 rounded-full hover:opacity-90 transition-opacity" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline space-x-2">
              <button onClick={(e) => handleProfileClick(e, displayUser.id)} className="font-bold hover:underline focus:outline-none">{displayUser.name}</button>
              <span className="text-sm text-gray-500">@{displayUser.id}</span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</span>
            </div>
            { post.content && <p className="mt-1">{post.content}</p> }
            
            {originalPost ? (
                <div className="mt-3 border border-gray-700 rounded-2xl p-3">
                    <div className="flex items-center space-x-2">
                         <button onClick={(e) => handleProfileClick(e, originalPost.user.id)} className="focus:outline-none flex-shrink-0">
                            <img src={originalPost.user.avatarUrl} alt={originalPost.user.name} className="w-6 h-6 rounded-full" />
                         </button>
                        <button onClick={(e) => handleProfileClick(e, originalPost.user.id)} className="font-bold text-sm hover:underline">{originalPost.user.name}</button>
                        <span className="text-xs text-gray-500">@{originalPost.user.id}</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className="text-xs text-gray-500">{formatTimestamp(originalPost.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-sm">{originalPost.content}</p>
                    <div className="mt-3">
                        {originalPost.imageUrl && (
                            <img src={originalPost.imageUrl} alt="Post content" className="rounded-xl border border-gray-700 max-h-80 w-full object-cover" />
                        )}
                        {originalPost.videoUrl && (
                            <video controls src={originalPost.videoUrl} className="rounded-xl border border-gray-700 max-h-80 w-full object-cover bg-black" />
                        )}
                    </div>
                </div>
            ) : (
                <div className="mt-3">
                    {post.imageUrl && (
                        <img src={post.imageUrl} alt="Post content" className="rounded-2xl border border-gray-700 max-h-96 w-full object-cover" />
                    )}
                    {post.videoUrl && (
                        <video controls src={post.videoUrl} className="rounded-2xl border border-gray-700 max-h-96 w-full object-cover bg-black" />
                    )}
                </div>
            )}

            <div className="flex justify-start space-x-12 mt-3 text-gray-500">
                <button 
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                >
                    <CommentIcon className="w-5 h-5" />
                    <span>{post.comments.length > 0 ? post.comments.length : ''}</span>
                </button>
                 <button 
                   onClick={handleLikeClick}
                   className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                 >
                    <HeartIcon className={`w-5 h-5 transition-transform duration-300 ${isLiked ? 'fill-current' : ''} ${isAnimating ? 'scale-125' : 'scale-100'}`} />
                    <span>{post.likes.count > 0 ? post.likes.count : ''}</span>
                </button>
                {!originalPost && (
                     <button 
                        onClick={() => onSharePost(post.id)}
                        className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                     >
                        <ShareIcon className="w-5 h-5" />
                        <span>{post.shareCount && post.shareCount > 0 ? post.shareCount : ''}</span>
                    </button>
                )}
            </div>
          </div>
        </div>
        
        {showComments && (
          <div className="bg-gray-900/50">
            <CommentForm currentUser={currentUser} onSubmit={(text) => onComment(post.id, text)} />
            <div className="py-2">
              {post.comments.length > 0 ? (
                post.comments.map(comment => (
                  <div key={comment.id} className="flex space-x-3 px-4 py-3">
                    <img src={comment.user.avatarUrl} alt={comment.user.name} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 bg-gray-800 rounded-lg p-3">
                        <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-sm">{comment.user.name}</span>
                            <span className="text-xs text-gray-500">@{comment.user.id}</span>
                        </div>
                        <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  </div>
                )).reverse() // Show newest comments first
              ) : (
                <p className="px-4 py-3 text-sm text-gray-500">No comments yet. Be the first to reply!</p>
              )}
            </div>
          </div>
        )}
    </div>
  );
};