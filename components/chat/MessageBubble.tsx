import React from 'react';
// FIX: Added .ts extension to import path
import type { ChatMessage, User } from '../../types.ts';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  sender?: User;
  currentUser: User;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage, sender, currentUser }) => {
    const alignment = isOwnMessage ? 'justify-end' : 'justify-start';
    const bgColor = isOwnMessage ? 'bg-blue-500' : 'bg-gray-700';
    const bubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl`;

    const otherParticipantId = sender?.id === currentUser.id ? null : sender?.id;
    const isReadByOther = otherParticipantId ? message.readBy.includes(otherParticipantId) : message.readBy.length > 1;

    return (
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end space-x-2 ${alignment} w-full`}>
                {!isOwnMessage && sender && (
                    <img src={sender.avatarUrl} alt={sender.name} className="w-8 h-8 rounded-full" />
                )}
                <div>
                    <div className={`${bubbleClasses} ${bgColor}`}>
                        <p>{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 px-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
            {isOwnMessage && isReadByOther && (
                <p className="text-xs text-gray-500 mt-1 px-2 text-right">Seen</p>
            )}
        </div>
    );
};