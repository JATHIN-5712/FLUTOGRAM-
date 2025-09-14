// This file previously held mock data for the application.
// In a client-server architecture, this data is now managed by and fetched from the backend server.
// See README.md for an example backend implementation.
// FIX: Added .ts extension to import path
import type { User, Post, Conversation } from './types.ts';

const alex: User = {
  id: 'alex',
  name: 'Alex Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  friends: ['brian', 'casey'],
  notifications: [
    { id: 'n1', type: 'like', fromUser: { id: 'brian', name: 'Brian Smith', avatarUrl: 'https://i.pravatar.cc/150?u=brian', friends:[], notifications:[], stories:[] }, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
    { id: 'n2', type: 'friend_request', fromUser: { id: 'diana', name: 'Diana Prince', avatarUrl: 'https://i.pravatar.cc/150?u=diana', friends:[], notifications:[], stories:[] }, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
  ],
  stories: [
    { id: 's1', imageUrl: 'https://picsum.photos/seed/story1/1080/1920', timestamp: new Date().toISOString() },
    { id: 's2', imageUrl: 'https://picsum.photos/seed/story2/1080/1920', timestamp: new Date().toISOString() },
  ]
};

const brian: User = {
  id: 'brian',
  name: 'Brian Smith',
  avatarUrl: 'https://i.pravatar.cc/150?u=brian',
  friends: ['alex'],
  notifications: [],
  stories: []
};

const casey: User = {
  id: 'casey',
  name: 'Casey Jones',
  avatarUrl: 'https://i.pravatar.cc/150?u=casey',
  friends: ['alex'],
  notifications: [],
  stories: [
    { id: 's3', imageUrl: 'https://picsum.photos/seed/story3/1080/1920', timestamp: new Date().toISOString() }
  ]
};

const diana: User = {
  id: 'diana',
  name: 'Diana Prince',
  avatarUrl: 'https://i.pravatar.cc/150?u=diana',
  friends: [],
  notifications: [],
  stories: []
};

const testuser: User = {
  id: 'testuser',
  name: 'Test User',
  avatarUrl: 'https://i.pravatar.cc/150?u=testuser',
  friends: [],
  notifications: [],
  stories: [],
};


export const USERS: User[] = [alex, brian, casey, diana, testuser];

export const INITIAL_POSTS: Post[] = [
    {
        id: 'post1',
        user: alex,
        content: 'Just enjoying the beautiful sunset! #nofilter',
        imageUrl: 'https://picsum.photos/seed/picsum/600/400',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        likes: { count: 12, users: ['brian'] },
        comments: [
            { id: 'c1', user: brian, text: 'Wow, amazing shot!', timestamp: new Date().toISOString() }
        ],
        shareCount: 2,
    },
    {
        id: 'post2',
        user: brian,
        content: 'Check out this cool video I made!',
        videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        likes: { count: 5, users: [] },
        comments: [],
        shareCount: 1,
    },
    {
        id: 'post3',
        user: casey,
        content: 'My new blog post is live! Link in bio.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        likes: { count: 25, users: ['alex', 'brian'] },
        comments: [],
    }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
    {
        id: 'convo1',
        participants: ['alex', 'brian'],
        messages: [
            { id: 'm1', senderId: 'brian', text: 'Hey, how are you?', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), readBy: ['alex'] },
            { id: 'm2', senderId: 'alex', text: 'Doing great, thanks for asking! You?', timestamp: new Date(Date.now() - 1000 * 60 * 59).toISOString(), readBy: [] },
        ]
    }
];
