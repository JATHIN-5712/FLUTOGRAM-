import React, { useState } from 'react';
// FIX: Added .ts extension to import path
import type { User, Post as PostType } from '../../types.ts';
import { Post } from '../feed/Post';

interface ProfileProps {
  profileUser: User;
  currentUser: User;
  userPosts: PostType[];
  userReels: PostType[];
  onComment: (postId: string, text: string) => void;
  onLikeToggle: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
  onStartChat: (userId: string) => void;
  onSendFriendRequest: (userId: string) => void;
}

const PostGridItem: React.FC<{ post: PostType }> = ({ post }) => (
    <div className="relative aspect-square bg-gray-800 rounded-sm overflow-hidden group">
        {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.content} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : post.videoUrl ? (
            <video src={post.videoUrl} className="w-full h-full object-cover" />
        ) : (
            <div className="p-2 flex items-center justify-center h-full">
                <p className="text-center text-sm text-gray-300">{post.content}</p>
            </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
             <p className="text-white text-center text-sm">{post.content}</p>
        </div>
    </div>
);

export const Profile: React.FC<ProfileProps> = ({ profileUser, currentUser, userPosts, userReels, onComment, onLikeToggle, onSharePost, onViewProfile, onStartChat, onSendFriendRequest }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
  const isOwnProfile = profileUser.id === currentUser.id;
  const isFriend = currentUser.friends.includes(profileUser.id);
  const isRequestSent = profileUser.notifications.some(n => n.type === 'friend_request' && n.fromUser.id === currentUser.id);

  const renderActionButton = () => {
    if (isOwnProfile) return <button onClick={() => alert('Edit Profile functionality coming soon!')} className="border border-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 transition-colors">Edit Profile</button>;
    if (isFriend) return <button onClick={() => onStartChat(profileUser.id)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors">Message</button>;
    if (isRequestSent) return <button disabled className="border border-gray-500 text-gray-400 font-bold py-2 px-4 rounded-full cursor-not-allowed">Request Sent</button>;
    return <button onClick={() => onSendFriendRequest(profileUser.id)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors">Add Friend</button>;
  }
  
  return (
    <div>
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">{profileUser.name}</h1>
        <p className="text-gray-400 text-sm">{userPosts.length + userReels.length} total posts</p>
      </div>
      
      <div>
        <div className="bg-gray-700 h-48 w-full"></div>
        <div className="p-4 -mt-16">
            <div className="flex justify-between items-start">
                <img src={profileUser.avatarUrl} alt={profileUser.name} className="w-32 h-32 rounded-full border-4 border-gray-900" />
                <div className="flex space-x-2 mt-16">{renderActionButton()}</div>
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-bold">{profileUser.name}</h2>
                <p className="text-gray-500">@{profileUser.id}</p>
                <p className="mt-2">{profileUser.bio || "No bio available."}</p>
                <div className="flex space-x-4 mt-2 text-gray-500">
                    <span><span className="font-bold text-white">{profileUser.following || 0}</span> Following</span>
                    <span><span className="font-bold text-white">{profileUser.followers || 0}</span> Followers</span>
                </div>
            </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700">
        <div className="flex justify-around">
            <button onClick={() => setActiveTab('posts')} className={`w-full p-4 font-bold ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-500'}`}>Posts</button>
            <button onClick={() => setActiveTab('reels')} className={`w-full p-4 font-bold ${activeTab === 'reels' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-500'}`}>Reels</button>
        </div>
        <div className="p-1">
            {activeTab === 'posts' && (
                <div className="grid grid-cols-3 gap-1">
                    {userPosts.map(post => <PostGridItem key={post.id} post={post} />)}
                </div>
            )}
            {activeTab === 'reels' && (
                 <div className="grid grid-cols-3 gap-1">
                    {userReels.map(reel => <PostGridItem key={reel.id} post={reel} />)}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};