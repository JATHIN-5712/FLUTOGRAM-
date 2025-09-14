import type { Post, User, GroupChatMessage } from '../types.ts';

// IMPORTANT: Replace this with your actual Render backend URL
const BASE_URL = 'https://flutogram-5.onrender.com/api';

let token: string | null = localStorage.getItem('token');

const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred');
    }
    // Handle cases where the response might be empty (e.g., 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return undefined as T;
    }
};

export const api = {
    setToken: (newToken: string | null) => {
        token = newToken;
    },
    
    healthCheck: async (): Promise<boolean> => {
        try {
            // IMPORTANT: The health check URL also needs to be updated
            const response = await fetch('https://your-backend-url.onrender.com/api/health');
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    login: async (email: string, password: string): Promise<{user: User, token: string}> => {
        return request<{user: User, token: string}>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    register: async (name: string, email: string, password: string, phone: string, avatarUrl?: string): Promise<{user: User, token: string}> => {
        return request<{user: User, token: string}>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, phone, avatarUrl }),
        });
    },

    getMe: async (): Promise<User> => {
        if (!token) throw new Error("No token available for authentication.");
        return request<User>('/auth/me');
    },

    getFeedPosts: async (): Promise<Post[]> => {
        return request<Post[]>('/posts/feed');
    },

    createPost: async (content: string, imageUrl?: string, videoUrl?: string): Promise<Post> => {
        return request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify({ content, imageUrl, videoUrl }),
        });
    },
    
    toggleLike: async (postId: string): Promise<Post> => {
        return request<Post>(`/posts/${postId}/like`, {
            method: 'POST',
        });
    },

    addComment: async (postId: string, text: string): Promise<Post> => {
        return request<Post>(`/posts/${postId}/comment`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
    },

    sharePost: async (postId: string): Promise<Post> => {
         return request<Post>(`/posts/${postId}/share`, {
            method: 'POST',
        });
    },

    getExplorePosts: async (): Promise<Post[]> => {
        return request<Post[]>('/posts/explore');
    },

    getGroupChatMessages: async (): Promise<GroupChatMessage[]> => {
        return request<GroupChatMessage[]>('/chat/group');
    }
};
