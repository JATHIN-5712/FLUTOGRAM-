import React from 'react';
// FIX: Added .tsx extension to import path
import { HomeIcon, ExploreIcon, ReelsIcon, ChatIcon, HeartIcon, UserIcon, UsersIcon, LogoutIcon } from '../common/Icons.tsx';
// FIX: Added type import
import type { User } from '../../types.ts';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentUser: User;
  unreadNotifications: number;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  hasBadge?: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, hasBadge, onClick }) => (
  <button onClick={onClick} className="flex items-center space-x-4 p-3 rounded-full hover:bg-gray-800 transition-colors w-full text-left">
    <div className="relative">
      {icon}
      {hasBadge && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-gray-900"></span>}
    </div>
    <span className={`text-xl hidden md:inline ${isActive ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, currentUser, unreadNotifications }) => {
  return (
    <aside className="w-20 md:w-72 p-2 flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="p-3 text-2xl font-bold text-blue-400 hidden md:block">
          Flutogram
        </div>
        <nav className="mt-4 space-y-2">
          <NavItem icon={<HomeIcon className="w-7 h-7" />} label="Home" isActive={activeView === 'feed'} onClick={() => onNavigate('feed')} />
          <NavItem icon={<ExploreIcon className="w-7 h-7" />} label="Explore" isActive={activeView === 'explore'} onClick={() => onNavigate('explore')} />
          <NavItem icon={<ReelsIcon className="w-7 h-7" />} label="Reels" isActive={activeView === 'reels'} onClick={() => onNavigate('reels')} />
          <NavItem icon={<UsersIcon className="w-7 h-7" />} label="Group Chat" isActive={activeView === 'group-chat'} onClick={() => onNavigate('group-chat')} />
          <NavItem icon={<ChatIcon className="w-7 h-7" />} label="Messages" isActive={activeView === 'chat'} onClick={() => onNavigate('chat')} />
          <NavItem
            icon={<HeartIcon className="w-7 h-7" />}
            label="Notifications"
            isActive={activeView === 'notifications'}
            hasBadge={unreadNotifications > 0}
            onClick={() => onNavigate('notifications')}
          />
           <NavItem icon={<UserIcon className="w-7 h-7" />} label="Profile" isActive={activeView === 'profile'} onClick={() => onNavigate(`profile/${currentUser.id}`)} />

          <button className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full w-full mt-4 hover:bg-blue-600 transition-colors hidden md:block">
            Post
          </button>
        </nav>
      </div>

      <div className="p-2">
        <div className="w-full flex items-center justify-between p-2 rounded-full hover:bg-gray-800 transition-colors group">
            <button onClick={() => onNavigate(`profile/${currentUser.id}`)} className="flex items-center space-x-3 flex-1">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                <div className="hidden md:block text-left">
                    <p className="font-bold">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">@{currentUser.id}</p>
                </div>
            </button>
            <button onClick={() => onNavigate('logout')} className="p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 hidden md:block" aria-label="Logout">
                <LogoutIcon className="w-6 h-6"/>
            </button>
        </div>
      </div>
    </aside>
  );
};
