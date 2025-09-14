import { io, Socket } from 'socket.io-client';
import type { GroupChatMessage } from '../types.ts';

const SOCKET_URL = 'http://localhost:3001';

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        if (this.socket?.connected) return;
        
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
