import React, { useState } from 'react';
// FIX: Added .ts extension to import path
import type { User, Conversation } from '../../types.ts';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';
import { NewMessageModal } from './NewMessageModal';
// FIX: Added .tsx extension to import path
import { ComposeIcon } from '../common/Icons.tsx';

interface ChatPageProps {
  currentUser: User;
  conversations: Conversation[];
  users: User[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onStartChat: (userId: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  currentUser,
  conversations,
  users,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onStartChat,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const userConversations = conversations.filter(c => c.participants.includes(currentUser.id));

  const handleStartChatFromModal = (userId: string) => {
    onStartChat(userId);
    setIsComposing(false);
  };

  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-md z-10 flex justify-between items-center">
              <h1 className="text-xl font-bold">Messages</h1>
              <button onClick={() => setIsComposing(true)} className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-gray-800" aria-label="New message">
                  <ComposeIcon className="w-6 h-6" />
              </button>
          </div>
          <div className="flex-1 flex overflow-hidden">
              <div className="w-1/3 border-r border-gray-700 overflow-y-auto">
                  <ConversationList 
                      conversations={userConversations}
                      users={users}
                      currentUser={currentUser}
                      onSelectConversation={onSelectConversation}
                      activeConversationId={activeConversationId}
                  />
              </div>
              <div className="w-2/3 flex flex-col">
                  <ConversationView 
                      conversation={activeConversation}
                      users={users}
                      currentUser={currentUser}
                      onSendMessage={onSendMessage}
                  />
              </div>
          </div>
      </div>
      {isComposing && (
        <NewMessageModal 
          users={users}
          currentUser={currentUser}
          onClose={() => setIsComposing(false)}
          onStartChat={handleStartChatFromModal}
        />
      )}
    </>
  );
};