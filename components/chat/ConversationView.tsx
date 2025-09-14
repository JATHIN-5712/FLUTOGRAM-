import React, { useState, useEffect, useRef } from 'react';
// FIX: Added .ts extension to import path
import type { User, Conversation } from '../../types.ts';
import { MessageBubble } from './MessageBubble';
// FIX: Added .ts extension to import path
import { socketService } from '../../services/socketService.ts';

interface ConversationViewProps {
  conversation?: Conversation;
  users: User[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string) => void;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1.5 px-4 py-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
    </div>
);


const MessageForm: React.FC<{ conversationId: string; currentUser: User; onSubmit: (text: string) => void; }> = ({ conversationId, currentUser, onSubmit }) => {
    const [text, setText] = useState('');
    const typingTimeoutRef = useRef<number | null>(null);

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (typingTimeoutRef.current) {
             socketService.emitTypingStatus(conversationId, currentUser.id, true);
        } else {
            clearTimeout(typingTimeoutRef.current as number);
        }

        typingTimeoutRef.current = window.setTimeout(() => {
            socketService.emitTypingStatus(conversationId, currentUser.id, false);
        }, 2000);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim()) {
            onSubmit(text);
            setText('');
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            socketService.emitTypingStatus(conversationId, currentUser.id, false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            <input
                type="text"
                value={text}
                onChange={handleTyping}
                placeholder="Start a new message"
                className="w-full bg-gray-800 rounded-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue-500"
            />
        </form>
    );
};

export const ConversationView: React.FC<ConversationViewProps> = ({ conversation, users, currentUser, onSendMessage }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

    useEffect(() => {
        if(conversation) {
            socketService.onTypingStatus(({ conversationId, userId, isTyping }) => {
                if (conversation.id === conversationId && userId !== currentUser.id) {
                    setIsOtherUserTyping(isTyping);
                }
            });
             // Mark messages as read when conversation is viewed
            const unreadMessages = conversation.messages.some(m => !m.readBy.includes(currentUser.id));
            if (unreadMessages) {
                socketService.emitMessagesRead(conversation.id, currentUser.id);
            }
        }
    }, [conversation, currentUser.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [conversation?.messages, isOtherUserTyping]);

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a conversation to start chatting.</p>
            </div>
        );
    }
    
    const otherUser = users.find(u => u.id === conversation.participants.find(pId => pId !== currentUser.id));

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            <div className="p-4 border-b border-gray-700">
                <h2 className="font-bold text-lg">{otherUser?.name || 'Chat'}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversation.messages.map(msg => (
                    <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        isOwnMessage={msg.senderId === currentUser.id} 
                        sender={users.find(u => u.id === msg.senderId)}
                        currentUser={currentUser}
                    />
                ))}
                {isOtherUserTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
            </div>
            <MessageForm conversationId={conversation.id} currentUser={currentUser} onSubmit={(text) => onSendMessage(conversation.id, text)} />
        </div>
    );
};