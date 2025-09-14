import React, { useState, useEffect } from 'react';
// FIX: Added .ts extension to import path
import type { User, Story } from '../../types.ts';

interface StoryViewerProps {
    userWithStories: User;
    allUsersWithStories: User[];
    onClose: () => void;
    onNextUser: () => void;
    onPrevUser: () => void;
}

const ProgressBar: React.FC<{ count: number; currentIndex: number; isPaused: boolean }> = ({ count, currentIndex, isPaused }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setProgress(0); // Reset progress when story changes
        if (!isPaused) {
            const interval = setInterval(() => {
                setProgress(prev => Math.min(prev + 100 / 500, 100)); // 5-second duration
            }, 10);
            return () => clearInterval(interval);
        }
    }, [currentIndex, isPaused]);

    return (
        <div className="flex space-x-1 w-full">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white"
                        style={{ width: `${i < currentIndex ? 100 : i === currentIndex ? progress : 0}%` }}
                    />
                </div>
            ))}
        </div>
    );
};

export const StoryViewer: React.FC<StoryViewerProps> = ({ userWithStories, onClose, onNextUser, onPrevUser }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const stories = userWithStories.stories;

    useEffect(() => {
        if (!isPaused) {
            const timer = setTimeout(() => {
                handleNextStory();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [currentStoryIndex, isPaused, userWithStories]);

    const handleNextStory = () => {
        if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
            onNextUser();
        }
    };

    const handlePrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        } else {
            onPrevUser();
        }
    };
    
     const handleMouseDown = () => setIsPaused(true);
     const handleMouseUp = () => setIsPaused(false);

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div className="relative w-full max-w-md h-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 p-4 z-20">
                    <ProgressBar count={stories.length} currentIndex={currentStoryIndex} isPaused={isPaused} />
                     <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                             <img src={userWithStories.avatarUrl} alt={userWithStories.name} className="w-8 h-8 rounded-full" />
                             <span className="font-bold text-white">{userWithStories.name}</span>
                        </div>
                        <button onClick={onClose} className="text-white text-3xl">&times;</button>
                    </div>
                </div>
                <img src={stories[currentStoryIndex].imageUrl} className="w-full h-full object-contain" />
                
                {/* Navigation overlays */}
                <div className="absolute inset-y-0 left-0 w-1/3" onClick={handlePrevStory}></div>
                <div className="absolute inset-y-0 right-0 w-1/3" onClick={handleNextStory}></div>
            </div>
             {/* Prev/Next User Buttons */}
            <button onClick={onPrevUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 text-3xl">‹</button>
            <button onClick={onNextUser} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 rounded-full p-2 text-3xl">›</button>
        </div>
    );
};