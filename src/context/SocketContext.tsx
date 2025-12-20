import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { Task } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  notifications: TaskNotification[];
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

interface TaskNotification {
  id: string;
  message: string;
  task: Task;
  timestamp: Date;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);

  useEffect(() => {
    if (!token) {
      if (socket) {
        console.log('Disconnecting socket');
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    console.log('🔌 Initializing socket connection...');

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setConnected(false);
    });

    // Listen for task events
    newSocket.on('task:created', (task: Task) => {
      console.log('📨 Received task:created event:', task.title);
    });

    newSocket.on('task:updated', (task: Task) => {
      console.log('📨 Received task:updated event:', task.title);
    });

    newSocket.on('task:deleted', (data: { taskId: string }) => {
      console.log('📨 Received task:deleted event:', data.taskId);
    });

    // Listen for task assignment notifications
    newSocket.on('task:assigned', (data: { message: string; task: Task }) => {
      console.log('🔔 Received task:assigned notification:', data.message);
      
      const notification: TaskNotification = {
        id: `${data.task._id}-${Date.now()}`,
        message: data.message,
        task: data.task,
        timestamp: new Date()
      };
      setNotifications((prev) => [notification, ...prev]);

      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('Task Assigned', {
          body: data.message,
          icon: '/favicon.ico'
        });
      }
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up socket connection');
      newSocket.disconnect();
    };
  }, [token]);

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        notifications,
        clearNotification,
        clearAllNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
