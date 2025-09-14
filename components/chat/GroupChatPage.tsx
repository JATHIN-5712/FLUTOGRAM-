import React, { useState, useEffect, useRef } from 'react';
import type { User, GroupChatMessage } from '../../types.ts';
import { SpinnerIcon } from '../common/Icons.tsx';

const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const GroupMessageBubble: React.FC<{ message: GroupChatMessage, isOwnMessage: boolean }> = ({ message, isOwnMessage }) => {
    const alignment = isOwnMessage ? 'items-end' : 'items-start';
    const bgColor = isOwnMessage ? 'bg-blue-600' : 'bg-gray-700';
    
    return (
        <div className={`flex flex-col ${alignment}`}>
            <div className={`flex items-start space-x-3 max-w-lg`}>
                {!isOwnMessage && (
                     <img src={message.user.avatarUrl} alt={message.user.name} className="w-8 h-8 rounded-full" />
                )}
                <div className="flex flex-col">
                    {!isOwnMessage && (
                        <span className="text-xs text-gray-400 ml-3 mb-1">{message.user.name}</span>
                    )}
                    <div className={`px-4 py-2 rounded-2xl ${bgColor}`}>
                        <p className="text-white">{message.text}</p>
                    </div>
                     <p className={`text-xs text-gray-500 mt-1 px-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTimestamp(message.timestamp)}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MessageForm: React.FC<{ onSendMessage: (text: string) => void }> = ({ onSendMessage }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-900">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message to the group..."
                className="w-full bg-gray-800 rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                autoComplete="off"
            />
        </form>
    );
};

interface GroupChatPageProps {
    messages: GroupChatMessage[];
    currentUser: User;
    onSendMessage: (text: string) => void;
}

export const GroupChatPage: React.FC<GroupChatPageProps> = ({ messages, currentUser, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10">
                <h1 className="text-xl font-bold">Global Group Chat</h1>
                <p className="text-sm text-gray-400">Talk with everyone online</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-6">
                {messages.length > 0 ? (
                    messages.map(msg => (
                        <GroupMessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isOwnMessage={msg.user.id === currentUser.id} 
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <SpinnerIcon className="w-8 h-8 animate-spin mb-4" />
                        <p>Loading messages...</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <MessageForm onSendMessage={onSendMessage} />
        </div>
    );
};
