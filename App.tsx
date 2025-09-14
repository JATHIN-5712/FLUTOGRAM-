import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/auth/AuthPage.tsx';
import { Sidebar } from './components/feed/Sidebar.tsx';
import { Feed } from './components/feed/Feed.tsx';
import { ExploreContent } from './components/explore/ExploreContent.tsx';
import { ReelsPage } from './components/reels/ReelsPage.tsx';
import { ChatPage } from './components/chat/ChatPage.tsx';
import { GroupChatPage } from './components/chat/GroupChatPage.tsx';
import { NotificationsPage } from './components/notifications/NotificationsPage.tsx';
import { Profile } from './components/profile/Profile.tsx';
import { RightSidebar } from './components/layout/RightSidebar.tsx';
import { StoryViewer } from './components/stories/StoryViewer.tsx';
import type { User, Post, Conversation, GroupChatMessage } from './types.ts';
import { USERS, INITIAL_CONVERSATIONS } from './constants.tsx';
import { api } from './services/api.ts';
import { socketService } from './services/socketService.ts';
import { SpinnerIcon } from './components/common/Icons.tsx';

const App: React.FC = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoadingApp, setIsLoadingApp] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    // Mock data state
    const [users, setUsers] = useState<User[]>(USERS);
    const [posts, setPosts] = useState<Post[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>(['alex', 'brian']);

    // Group Chat State
    const [groupMessages, setGroupMessages] = useState<GroupChatMessage[]>([]);

    const [activeView, setActiveView] = useState<string>('feed');
    const [viewingStory, setViewingStory] = useState<User | null>(null);

     useEffect(() => {
        const loadUser = async () => {
            if (token) {
                api.setToken(token);
                try {
                    const user = await api.getMe();
                    setCurrentUser(user);
                    socketService.connect(user.id);
                } catch (e) {
                    console.error("Session token is invalid, logging out.", e);
                    handleLogout();
                }
            }
            setIsLoadingApp(false);
        };
        loadUser();
    }, [token]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (currentUser) {
                try {
                    setIsLoadingPosts(true);
                    const feedPosts = await api.getFeedPosts();
                    setPosts(feedPosts);
                } catch (error) {
                    console.error("Failed to fetch posts:", error);
                } finally {
                    setIsLoadingPosts(false);
                }
            }
        };
        fetchPosts();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            // Fetch initial group messages
            api.getGroupChatMessages()
                .then(setGroupMessages)
                .catch(err => console.error("Failed to fetch group messages:", err));

            // Listen for new messages
            socketService.onGroupMessageReceived((newMessage) => {
                setGroupMessages(prev => [...prev, newMessage]);
            });

            // Listen for new posts from anyone
            socketService.onNewPost((newPost) => {
                // Add the new post to the top of the feed in real-time
                setPosts(prev => [newPost, ...prev]);
            });
        }
    }, [currentUser]);

    const handleLogin = async (email: string, password: string) => {
        const { user, token } = await api.login(email, password);
        localStorage.setItem('token', token);
        api.setToken(token);
        setToken(token);
        setCurrentUser(user); // Set user immediately for faster UI update
    };

    const handleRegister = async (name: string, email: string, password: string, phone: string, avatarUrl?: string) => {
        const { user, token } = await api.register(name, email, password, phone, avatarUrl);
        localStorage.setItem('token', token);
        api.setToken(token);
        setToken(token);
        setUsers(prev => [...prev, user]);
        setCurrentUser(user);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        api.setToken(null);
        setToken(null);
        setCurrentUser(null);
        socketService.disconnect();
        setActiveView('feed');
    };

    const handleNavigate = (view: string) => {
        if (view === 'logout') {
            handleLogout();
            return;
        }
        setActiveView(view);
    };
    
    const handleViewProfile = (userId: string) => {
        setActiveView(`profile/${userId}`);
    };
    
    const handleStartChat = (userId: string) => {
        if (!currentUser) return;
        const existingConvo = conversations.find(c => c.participants.includes(userId) && c.participants.includes(currentUser.id));
        if (existingConvo) {
            setActiveView(`chat/${existingConvo.id}`);
        } else {
            const newConvoId = `convo-${Date.now()}`;
            const newConvo: Conversation = {
                id: newConvoId,
                participants: [currentUser.id, userId],
                messages: []
            };
            setConversations(prev => [...prev, newConvo]);
            setActiveView(`chat/${newConvoId}`);
        }
    }
    
    const handleCreatePost = async (content: string, imageUrl?: string, videoUrl?: string) => {
        if (!currentUser) return;
        try {
            // The post is sent to the backend. The backend will then broadcast it
            // via sockets to all clients (including this one), where it will be
            // added to the state via the `onNewPost` listener.
            await api.createPost(content, imageUrl, videoUrl);
        } catch (error) {
            console.error("Failed to create post:", error);
            // Optionally show an error to the user
        }
    };
    
    const handleSendGroupMessage = (text: string) => {
        if (currentUser) {
            socketService.sendGroupMessage({ userId: currentUser.id, text });
        }
    };
    
    const renderContent = () => {
        const [view, param] = activeView.split('/');
        
        switch(view) {
            case 'feed':
                return <Feed 
                    posts={posts} 
                    currentUser={currentUser!}
                    stories={users.filter(u => u.stories?.length > 0)}
                    onCreatePost={handleCreatePost}
                    onComment={(postId, text) => console.log('Comment:', postId, text)}
                    onLikeToggle={(postId) => console.log('Like:', postId)}
                    onSharePost={(postId) => console.log('Share:', postId)}
                    onViewProfile={handleViewProfile}
                    onViewStory={setViewingStory}
                    onCreateStory={async (imageUrl) => console.log('Create story', imageUrl)}
                    isLoading={isLoadingPosts}
                 />;
            case 'explore':
                return <ExploreContent onAddPosts={(newPosts) => setPosts(p => [...newPosts, ...p])} />;
            case 'reels':
                const reels = posts.filter(p => p.videoUrl && !p.imageUrl);
                return <ReelsPage reels={reels} currentUser={currentUser!} onLikeToggle={() => {}} onComment={() => {}} onSharePost={() => {}} onViewProfile={handleViewProfile} />;
            case 'group-chat':
                return <GroupChatPage messages={groupMessages} currentUser={currentUser!} onSendMessage={handleSendGroupMessage} />;
            case 'chat':
                return <ChatPage 
                    currentUser={currentUser!} 
                    conversations={conversations} 
                    users={users} 
                    activeConversationId={param}
                    onSelectConversation={(convoId) => setActiveView(`chat/${convoId}`)}
                    onSendMessage={(convoId, text) => console.log('Send message', convoId, text)}
                    onStartChat={handleStartChat}
                 />;
            case 'notifications':
                return <NotificationsPage currentUser={currentUser!} onRespondToRequest={() => {}} onViewProfile={handleViewProfile} />;
            case 'profile':
                const profileUser = users.find(u => u.id === param);
                if (!profileUser) return <div>User not found</div>;
                return <Profile 
                    profileUser={profileUser}
                    currentUser={currentUser!}
                    userPosts={posts.filter(p => p.user.id === param && !p.videoUrl)}
                    userReels={posts.filter(p => p.user.id === param && p.videoUrl)}
                    onComment={() => {}} onLikeToggle={() => {}} onSharePost={() => {}} onViewProfile={handleViewProfile} onStartChat={handleStartChat} onSendFriendRequest={() => {}}
                />;
            default:
                return <Feed posts={posts} currentUser={currentUser!} stories={[]} onCreatePost={async () => {}} onComment={() => {}} onLikeToggle={() => {}} onSharePost={() => {}} onViewProfile={() => {}} onViewStory={() => {}} onCreateStory={async () => {}} isLoading={false} />;
        }
    }

    if (isLoadingApp) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
                <SpinnerIcon className="w-12 h-12 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!currentUser) {
        return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />;
    }
    
    const usersWithStories = users.filter(u => u.stories && u.stories.length > 0);
    const viewingStoryUserIndex = viewingStory ? usersWithStories.findIndex(u => u.id === viewingStory.id) : -1;

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <div className="container mx-auto flex">
                <Sidebar 
                    activeView={activeView.split('/')[0]} 
                    onNavigate={handleNavigate} 
                    currentUser={currentUser}
                    unreadNotifications={currentUser.notifications.filter(n => !n.read).length}
                />
                <main className="flex-grow border-x border-gray-700 max-w-2xl">
                    {renderContent()}
                </main>
                <RightSidebar 
                    onlineUserIds={onlineUserIds} 
                    users={users} 
                    currentUser={currentUser}
                    onViewProfile={handleViewProfile}
                    onStartChat={handleStartChat}
                />
            </div>
            {viewingStory && (
                <StoryViewer 
                    userWithStories={viewingStory}
                    allUsersWithStories={usersWithStories}
                    onClose={() => setViewingStory(null)}
                    onNextUser={() => {
                        const nextIndex = (viewingStoryUserIndex + 1) % usersWithStories.length;
                        setViewingStory(usersWithStories[nextIndex]);
                    }}
                    onPrevUser={() => {
                        const prevIndex = (viewingStoryUserIndex - 1 + usersWithStories.length) % usersWithStories.length;
                        setViewingStory(usersWithStories[prevIndex]);
                    }}
                />
            )}
        </div>
    );
};

export default App;