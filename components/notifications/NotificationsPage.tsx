import React from 'react';
// FIX: Added .ts extension to import path
import type { User, Notification as NotificationType } from '../../types.ts';
// FIX: Added .tsx extension to import path
import { HeartIcon, CommentIcon, UserIcon, ShareIcon } from '../common/Icons.tsx';

interface NotificationsPageProps {
  currentUser: User;
  onRespondToRequest: (requestorId: string, response: 'accept' | 'decline', notificationId: string) => void;
  onViewProfile: (userId: string) => void;
}

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));

    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationItem: React.FC<{ notification: NotificationType, onRespond: any, onViewProfile: any }> = ({ notification, onRespond, onViewProfile }) => {
    
    const getIcon = () => {
        switch (notification.type) {
            case 'like': return <HeartIcon className="w-6 h-6 text-red-500" />;
            case 'comment': return <CommentIcon className="w-6 h-6 text-blue-500" />;
            case 'share': return <ShareIcon className="w-6 h-6 text-green-500" />;
            case 'friend_request':
            case 'friend_accept': return <UserIcon className="w-6 h-6 text-green-500" />;
            default: return null;
        }
    };

    const getMessage = () => {
        const userName = <strong onClick={(e) => { e.stopPropagation(); onViewProfile(notification.fromUser.id); }} className="cursor-pointer hover:underline">{notification.fromUser.name}</strong>;
        switch (notification.type) {
            case 'like': return <>{userName} liked your post.</>;
            case 'comment': return <>{userName} commented on your post.</>;
            case 'share': return <>{userName} shared your post.</>;
            case 'friend_request': return <>{userName} sent you a friend request.</>;
            case 'friend_accept': return <>{userName} accepted your friend request.</>;
            default: return 'New notification';
        }
    }

    return (
        <div className={`p-4 flex items-start space-x-4 border-b border-gray-700 ${!notification.read ? 'bg-blue-900/20' : ''}`}>
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
                <div className="flex items-center space-x-3">
                    <img src={notification.fromUser.avatarUrl} alt={notification.fromUser.name} className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-gray-200">{getMessage()}</p>
                        <p className="text-sm text-gray-500">{formatTimestamp(notification.timestamp)}</p>
                    </div>
                </div>
                {notification.type === 'friend_request' && (
                    <div className="mt-3 flex space-x-2">
                        <button onClick={() => onRespond(notification.fromUser.id, 'accept', notification.id)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full text-sm">Accept</button>
                        <button onClick={() => onRespond(notification.fromUser.id, 'decline', notification.id)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-4 rounded-full text-sm">Decline</button>
                    </div>
                )}
            </div>
        </div>
    );
};


export const NotificationsPage: React.FC<NotificationsPageProps> = ({ currentUser, onRespondToRequest, onViewProfile }) => {
  return (
    <div>
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10">
            <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <div>
            {currentUser.notifications.length > 0 ? (
                currentUser.notifications.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(notif => (
                    <NotificationItem 
                        key={notif.id} 
                        notification={notif} 
                        onRespond={onRespondToRequest} 
                        onViewProfile={onViewProfile}
                    />
                ))
            ) : (
                <p className="text-center text-gray-500 p-8">You have no new notifications.</p>
            )}
        </div>
    </div>
  );
};