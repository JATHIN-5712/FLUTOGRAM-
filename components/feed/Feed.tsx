import React from 'react';
// FIX: Added .ts extension to import path
import type { Post as PostType, User } from '../../types.ts';
import { CreatePost } from './CreatePost';
import { Post } from './Post';
import { StoriesBar } from '../stories/StoriesBar';

interface FeedProps {
  posts: PostType[];
  currentUser: User;
  stories: User[];
  onCreatePost: (content: string, imageUrl?: string, videoUrl?: string) => Promise<void>;
  onCreateStory: (imageUrl: string) => Promise<void>;
  onComment: (postId: string, text: string) => void;
  onLikeToggle: (postId: string) => void;
  onSharePost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
  onViewStory: (user: User) => void;
  isLoading: boolean;
}

const PostSkeleton: React.FC = () => (
    <div className="p-4 border-b border-gray-700 animate-pulse">
        <div className="flex space-x-4">
            <div className="w-12 h-12 rounded-full bg-gray-700"></div>
            <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                </div>
                 <div className="h-40 bg-gray-700 rounded-lg mt-2"></div>
            </div>
        </div>
    </div>
);

export const Feed: React.FC<FeedProps> = ({ posts, currentUser, stories, onCreatePost, onCreateStory, onComment, onLikeToggle, onSharePost, onViewProfile, onViewStory, isLoading }) => {
  return (
    <div>
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold">Home</h1>
        </div>
        <StoriesBar usersWithStories={stories} currentUser={currentUser} onViewStory={onViewStory} onCreateStory={onCreateStory} />
        <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
        {isLoading ? (
            <div>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        ) : posts.map(post => (
            <Post key={post.id} post={post} currentUser={currentUser} onComment={onComment} onLikeToggle={onLikeToggle} onSharePost={onSharePost} onViewProfile={onViewProfile} />
        ))}
    </div>
  );
};