import React, { useState, useRef } from 'react';
// FIX: Added .ts extension to import path
import type { User } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { PhotoIcon, VideoIcon, SpinnerIcon } from '../common/Icons.tsx';
import { VideoRecorder } from '../chat/VideoRecorder.tsx';

interface CreatePostProps {
  currentUser: User;
  onCreatePost: (content: string, imageUrl?: string, videoUrl?: string) => Promise<void>;
}

export const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<{type: 'image' | 'video', url: string} | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMedia({ type: 'image', url: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoReady = (videoUrl: string) => {
    setMedia({ type: 'video', url: videoUrl });
    setIsRecording(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || media) {
      setIsPosting(true);
      const imageUrl = media?.type === 'image' ? media.url : undefined;
      const videoUrl = media?.type === 'video' ? media.url : undefined;
      await onCreatePost(content, imageUrl, videoUrl);
      setContent('');
      setMedia(null);
      setIsPosting(false);
    }
  };

  return (
    <>
      <div className="p-4 border-b border-gray-700 flex space-x-4">
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
        <form onSubmit={handleSubmit} className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="w-full bg-transparent text-xl p-2 outline-none resize-none"
            rows={3}
          />

          {media && (
            <div className="mt-3 relative">
              {media.type === 'image' && <img src={media.url} alt="Preview" className="rounded-2xl border border-gray-700 max-h-96 w-full object-cover" />}
              {media.type === 'video' && <video src={media.url} controls className="rounded-2xl border border-gray-700 max-h-96 w-full object-cover" />}
              <button
                onClick={() => setMedia(null)}
                className="absolute top-2 right-2 bg-gray-900/50 text-white rounded-full p-1.5 hover:bg-gray-900"
                aria-label="Remove media"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2 text-blue-500">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-blue-500/10" aria-label="Add photo">
                    <PhotoIcon className="w-6 h-6" />
                </button>
                <button type="button" onClick={() => setIsRecording(true)} className="p-2 rounded-full hover:bg-blue-500/10" aria-label="Record video">
                    <VideoIcon className="w-6 h-6" />
                </button>
            </div>
            <button
              type="submit"
              disabled={(!content.trim() && !media) || isPosting}
              className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center w-24"
            >
              {isPosting ? <SpinnerIcon className="w-6 h-6 animate-spin" /> : 'Post'}
            </button>
          </div>
        </form>
      </div>
      {isRecording && <VideoRecorder onClose={() => setIsRecording(false)} onVideoReady={handleVideoReady} />}
    </>
  );
};