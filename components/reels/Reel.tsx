import React from 'react';
// FIX: Added .ts extension to import path
import type { Post, User } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { HeartIcon, CommentIcon, ShareIcon } from '../common/Icons.tsx';

interface ReelProps {
    post: Post;
    currentUser: User;
    onLikeToggle: (postId: string) => void;
    onComment: (postId: string, text: string) => void;
    onSharePost: (postId: string) => void;
    onViewProfile: (userId: string) => void;
}

export const Reel: React.FC<ReelProps> = ({ post, currentUser, onLikeToggle, onComment, onSharePost, onViewProfile }) => {
    const isLiked = post.likes.users.includes(currentUser.id);

    return (
        <div className="relative w-full h-full">
            <video
                src={post.videoUrl}
                loop
                playsInline
                className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-end justify-between">
                    {/* Left side: User info & content */}
                    <div className="text-white">
                        <div className="flex items-center space-x-2">
                             <img
                                src={post.user.avatarUrl}
                                alt={post.user.name}
                                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                                onClick={() => onViewProfile(post.user.id)}
                            />
                            <h3 className="font-bold cursor-pointer" onClick={() => onViewProfile(post.user.id)}>{post.user.name}</h3>
                        </div>
                        <p className="mt-2 text-sm">{post.content}</p>
                    </div>

                    {/* Right side: Action buttons */}
                    <div className="flex flex-col items-center space-y-4 text-white">
                         <button onClick={() => onLikeToggle(post.id)} className="flex flex-col items-center">
                            <HeartIcon className={`w-8 h-8 transition-colors ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
                            <span className="text-sm font-semibold">{post.likes.count}</span>
                        </button>
                         <button onClick={() => alert('Commenting on reels coming soon!')} className="flex flex-col items-center">
                            <CommentIcon className="w-8 h-8" />
                             <span className="text-sm font-semibold">{post.comments.length}</span>
                        </button>
                         <button onClick={() => onSharePost(post.id)} className="flex flex-col items-center">
                            <ShareIcon className="w-8 h-8" />
                            <span className="text-sm font-semibold">{post.shareCount || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};