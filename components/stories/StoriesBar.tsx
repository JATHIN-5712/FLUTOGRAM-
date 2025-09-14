import React, { useRef } from 'react';
// FIX: Added .ts extension to import path
import type { User } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { PlusCircleIcon } from '../common/Icons.tsx';

interface StoriesBarProps {
    usersWithStories: User[];
    currentUser: User;
    onViewStory: (user: User) => void;
    onCreateStory: (imageUrl: string) => void;
}

const StoryAvatar: React.FC<{ user: User; isCurrentUser?: boolean; hasUnseenStories?: boolean; onClick: () => void; }> = ({ user, isCurrentUser = false, hasUnseenStories = true, onClick }) => {
    const ringColor = hasUnseenStories ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' : 'bg-gray-700';
    return (
        <div className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group" onClick={onClick}>
            <div className={`rounded-full p-0.5 ${ringColor}`}>
                <div className="bg-gray-900 rounded-full p-0.5">
                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full object-cover group-hover:scale-95 transition-transform" />
                </div>
            </div>
            <p className="text-xs text-gray-300 w-20 text-center truncate">{isCurrentUser ? "Your Story" : user.name}</p>
        </div>
    );
};

const CreateStory: React.FC<{ currentUser: User; onCreateStory: (imageUrl: string) => void; }> = ({ currentUser, onCreateStory }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onCreateStory(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
            <div className="relative">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-16 h-16 rounded-full object-cover" />
                 <PlusCircleIcon className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 text-white rounded-full border-2 border-gray-900" />
                 <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            </div>
            <p className="text-xs text-gray-300 w-20 text-center truncate">Create Story</p>
        </div>
    );
};


export const StoriesBar: React.FC<StoriesBarProps> = ({ usersWithStories, currentUser, onViewStory, onCreateStory }) => {
    return (
        <div className="p-4 border-b border-gray-700">
            <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2">
                <CreateStory currentUser={currentUser} onCreateStory={onCreateStory} />
                {usersWithStories.map(user => (
                    <StoryAvatar key={user.id} user={user} onClick={() => onViewStory(user)} />
                ))}
            </div>
        </div>
    );
};