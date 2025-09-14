import React, { useState, useEffect } from 'react';
import { generateSuggestedPosts } from '../../services/geminiService';
// FIX: Added .ts extension to import path
import { api } from '../../services/api.ts';
// FIX: Added .ts extension to import path
import type { Post } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { SparklesIcon } from '../common/Icons.tsx';

interface ExploreContentProps {
  onAddPosts: (posts: Post[]) => void;
}

const PostGridItem: React.FC<{ post: Post }> = ({ post }) => (
    <div className="relative aspect-square bg-gray-800 rounded-md overflow-hidden group">
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


export const ExploreContent: React.FC<ExploreContentProps> = ({ onAddPosts }) => {
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
        setIsLoading(true);
        try {
            const posts = await api.getExplorePosts();
            setExplorePosts(posts);
        } catch (error) {
            console.error("Failed to fetch explore posts:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchExplorePosts();
  }, []);
  
  const handleGenerateAndAdd = async () => {
    const geminiPosts = await generateSuggestedPosts();
    onAddPosts(geminiPosts as Post[]);
  }

  return (
    <div>
      <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">Explore</h1>
        <p className="text-gray-400 text-sm">Discover new content from the community.</p>
      </div>

      <div className="p-4">
        <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 text-center mb-6">
            <SparklesIcon className="w-12 h-12 mx-auto text-blue-400 mb-2"/>
            <h2 className="text-lg font-semibold">Generate Your Feed</h2>
            <p className="text-blue-200/80 mb-4 text-sm">Let Gemini create interesting posts for you to explore.</p>
            <button
                onClick={handleGenerateAndAdd}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center mx-auto"
            >
              Generate & Add to Feed
            </button>
        </div>
        
        {isLoading ? (
            <div className="grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-800 animate-pulse rounded-md"></div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-3 gap-1">
                {explorePosts.map(post => (
                    <PostGridItem key={post.id} post={post} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};