import React from 'react';
// FIX: Added .ts extension to import path
import type { User } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { ChatBubbleIcon } from '../common/Icons.tsx';

interface RightSidebarProps {
  onlineUserIds: string[];
  users: User[];
  currentUser: User;
  onViewProfile: (userId: string) => void;
  onStartChat: (userId: string) => void;
}

const OnlineUser: React.FC<{
    user: User;
    onViewProfile: (userId: string) => void;
    onStartChat: (userId: string) => void;
    isCurrentUser: boolean;
}> = ({ user, onViewProfile, onStartChat, isCurrentUser }) => (
    <div className="w-full flex items-center justify-between p-2 hover:bg-gray-700/50 rounded-lg transition-colors group">
        <button
            onClick={() => onViewProfile(user.id)}
            className="flex items-center space-x-3 text-left flex-1"
            aria-label={`View profile of ${user.name}`}
        >
            <div className="relative">
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
            </div>
            <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">@{user.id}</p>
            </div>
        </button>
        {!isCurrentUser && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onStartChat(user.id);
                }}
                aria-label={`Chat with ${user.name}`}
                className="p-2 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-blue-500/20 hover:text-blue-400 focus:opacity-100 transition-opacity"
            >
                <ChatBubbleIcon className="w-5 h-5" />
            </button>
        )}
    </div>
);


export const RightSidebar: React.FC<RightSidebarProps> = ({ onlineUserIds, users, currentUser, onViewProfile, onStartChat }) => {
    const onlineUsers = onlineUserIds
        .map(id => users.find(user => user.id === id))
        .filter((user): user is User => user !== undefined);

    return (
        <aside className="w-96 p-4 hidden lg:block">
            <div className="sticky top-4 space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="font-bold text-lg mb-3">What's Happening</h2>
                    <p className="text-sm text-gray-400 mt-2">Trends feature coming soon...</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="font-bold text-lg mb-3">Who's Online</h2>
                    <div className="space-y-2">
                        {onlineUsers.length > 1 ? (
                            onlineUsers.map(user => (
                                <OnlineUser
                                    key={user.id}
                                    user={user}
                                    onViewProfile={onViewProfile}
                                    onStartChat={onStartChat}
                                    isCurrentUser={user.id === currentUser.id}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">No other users currently online.</p>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};