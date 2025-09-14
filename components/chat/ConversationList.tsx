import React from 'react';
// FIX: Added .ts extension to import path
import type { User, Conversation } from '../../types.ts';

interface ConversationListProps {
  conversations: Conversation[];
  users: User[];
  currentUser: User;
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ conversations, users, currentUser, activeConversationId, onSelectConversation }) => {
  
  const getOtherParticipant = (convo: Conversation) => {
    const otherId = convo.participants.find(pId => pId !== currentUser.id);
    return users.find(u => u.id === otherId);
  }

  return (
    <div>
        {conversations.map(convo => {
            const otherUser = getOtherParticipant(convo);
            if (!otherUser) return null;

            const lastMessage = convo.messages[convo.messages.length - 1];
            const isActive = convo.id === activeConversationId;

            return (
                <button 
                    key={convo.id}
                    onClick={() => onSelectConversation(convo.id)}
                    className={`w-full text-left flex items-center p-3 space-x-3 transition-colors ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
                >
                    <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-bold">{otherUser.name}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {lastMessage ? `${lastMessage.senderId === currentUser.id ? 'You: ' : ''}${lastMessage.text}` : 'No messages yet'}
                        </p>
                    </div>
                </button>
            )
        })}
    </div>
  );
};