import React, { useState } from 'react';
// FIX: Added .ts extension to import path
import type { User } from '../../types.ts';

interface NewMessageModalProps {
  users: User[];
  currentUser: User;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

export const NewMessageModal: React.FC<NewMessageModalProps> = ({ users, currentUser, onClose, onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.id !== currentUser.id &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full h-2/3 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold">New Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 border-b border-gray-700">
          <input
            type="text"
            placeholder="Search for people"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <ul>
              {filteredUsers.map(user => (
                <li key={user.id}>
                  <button
                    onClick={() => onStartChat(user.id)}
                    className="w-full text-left flex items-center p-3 space-x-3 hover:bg-gray-700 transition-colors"
                  >
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold">{user.name}</p>
                      <p className="text-sm text-gray-400">@{user.id}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 p-8">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};