import React, { useEffect, useRef } from 'react';
// FIX: Added .ts extension to import path
import type { Post, User } from '../../types.ts';
import { Reel } from './Reel';

interface ReelsPageProps {
  reels: Post[];
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onSharePost: (postId: string) => void;
  onViewProfile: (userId: string) => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ reels, currentUser, onLikeToggle, onComment, onSharePost, onViewProfile }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.75, // Trigger when 75% of the video is visible
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (video) {
                    if (entry.isIntersecting) {
                        video.play().catch(error => console.log("Video autoplay failed:", error));
                    } else {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        const reelsElements = containerRef.current?.querySelectorAll('.reel-item');
        if (reelsElements) {
            reelsElements.forEach(reel => observer.observe(reel));
        }

        return () => {
            if (reelsElements) {
                reelsElements.forEach(reel => observer.unobserve(reel));
            }
        };
    }, [reels]);

    return (
        <div ref={containerRef} className="h-screen w-full overflow-y-auto snap-y snap-mandatory relative scrollbar-hide">
            {reels.map((reel) => (
                <div key={reel.id} className="reel-item h-screen w-full snap-start flex items-center justify-center bg-black">
                    <Reel
                        post={reel}
                        currentUser={currentUser}
                        onLikeToggle={onLikeToggle}
                        onComment={onComment}
                        onSharePost={onSharePost}
                        onViewProfile={onViewProfile}
                    />
                </div>
            ))}
        </div>
    );
};