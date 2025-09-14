export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  following?: number;
  followers?: number;
  friends: string[];
  notifications: Notification[];
  stories: Story[];
}

export interface Story {
    id: string;
    imageUrl: string;
    timestamp: string;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
  likes: {
    count: number;
    users: string[];
  };
  comments: Comment[];
  shareCount?: number;
  originalPost?: Post; // For shared posts
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp:string;
  readBy: string[];
}

export interface Conversation {
  id: string;
  participants: string[];
  messages: ChatMessage[];
}

export interface GroupChatMessage {
  id: string;
  user: User; // The sender
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'share' | 'friend_request' | 'friend_accept' | 'group-chat';
  fromUser: User;
  timestamp: string;
  read: boolean;
  postId?: string; // For post-related notifications
}
