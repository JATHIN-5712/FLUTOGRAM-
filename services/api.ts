import type { Post, User, GroupChatMessage } from '../types.ts';

const BASE_URL = 'http://localhost:3001/api';

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
            const response = await fetch('http://localhost:3001/api/health');
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
    
    getExplorePosts: async (): Promise<Post[]> => {
        return request<Post[]>('/posts/explore');
    },

    getGroupChatMessages: async (): Promise<GroupChatMessage[]> => {
        return request<GroupChatMessage[]>('/chat/group');
    }
};
