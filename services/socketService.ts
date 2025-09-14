import { io, Socket } from 'socket.io-client';
import type { GroupChatMessage, Post } from '../types.ts';

// IMPORTANT: Replace this with your actual Render backend URL
const SOCKET_URL = 'https://your-backend-url.onrender.com';

// FIX: Define event maps for typed Socket.IO events. This resolves type inference issues with methods like .on().
interface ServerToClientEvents {
    connect: () => void;
    disconnect: (reason: string) => void;
    connect_error: (err: Error) => void;
    new_post: (post: Post) => void;
    post_updated: (post: Post) => void;
    new_group_message: (message: GroupChatMessage) => void;
    typing_status: (data: { conversationId: string; userId: string; isTyping: boolean; }) => void;
    messages_read: (data: { conversationId: string; readerId: string; }) => void;
}

interface ClientToServerEvents {
    send_group_message: (data: { userId: string; text: string }) => void;
    typing_status: (data: { conversationId: string; userId: string; isTyping: boolean; }) => void;
    messages_read: (data: { conversationId: string; userId: string; }) => void;
}

class SocketService {
    // FIX: Use the defined event maps for a strongly-typed socket instance.
    private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

    connect(userId: string) {
        if (this.socket?.connected) return;
        
        // FIX: The 'query' option for io() is valid in socket.io-client v3/v4. The type error reported
        // likely stems from a library/type version mismatch. Providing a strongly-typed socket
        // instance helps TypeScript resolve method and option types correctly.
        this.socket = io(SOCKET_URL, {
            query: { userId },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log(`[Socket] Connected with ID: ${this.socket?.id}, for user: ${userId}`);
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`[Socket] Disconnected: ${reason}`);
        });
        
        this.socket.on('connect_error', (err) => {
            console.error(`[Socket] Connection error: ${err.message}`);
        });
    }
    
    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    onNewPost(handler: (post: Post) => void) {
        this.socket?.on('new_post', handler);
    }

    onPostUpdated(handler: (post: Post) => void) {
        this.socket?.on('post_updated', handler);
    }

    // Group Chat
    sendGroupMessage(data: { userId: string; text: string }) {
        this.socket?.emit('send_group_message', data);
    }

    onGroupMessageReceived(handler: (message: GroupChatMessage) => void) {
        this.socket?.on('new_group_message', handler);
    }
    
    // Private Chat
    emitTypingStatus(conversationId: string, userId: string, isTyping: boolean) {
        this.socket?.emit('typing_status', { conversationId, userId, isTyping });
    }

    onTypingStatus(handler: (data: { conversationId: string; userId: string; isTyping: boolean; }) => void) {
        this.socket?.on('typing_status', handler);
    }

    emitMessagesRead(conversationId: string, userId: string) {
        this.socket?.emit('messages_read', { conversationId, userId });
    }

    onMessagesRead(handler: (data: { conversationId: string; readerId: string; }) => void) {
        this.socket?.on('messages_read', handler);
    }
}

export const socketService = new SocketService();