import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket']
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setConnected(true);
        setSocket(newSocket);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection failed. Please check your internet connection.');
      });

      // Message events
      newSocket.on('new_message', (data) => {
        // Handle new message
        handleNewMessage(data);
      });

      newSocket.on('message_sent', (data) => {
        // Handle message sent confirmation
        handleMessageSent(data);
      });

      newSocket.on('message_read', (data) => {
        // Handle message read receipt
        handleMessageRead(data);
      });

      newSocket.on('message_error', (data) => {
        toast.error(data.error || 'Message sending failed');
      });

      // Typing events
      newSocket.on('user_typing', (data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.chatId]: {
            ...prev[data.chatId],
            [data.userId]: {
              username: data.username,
              timestamp: Date.now()
            }
          }
        }));
      });

      newSocket.on('user_stopped_typing', (data) => {
        setTypingUsers(prev => {
          const newTypingUsers = { ...prev };
          if (newTypingUsers[data.chatId]) {
            delete newTypingUsers[data.chatId][data.userId];
            if (Object.keys(newTypingUsers[data.chatId]).length === 0) {
              delete newTypingUsers[data.chatId];
            }
          }
          return newTypingUsers;
        });
      });

      // User status events
      newSocket.on('user_status_changed', (data) => {
        if (data.status === 'online') {
          setOnlineUsers(prev => new Set([...prev, data.userId]));
        } else {
          setOnlineUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(data.userId);
            return newSet;
          });
        }
      });

      // Chat events
      newSocket.on('user_joined_chat', (data) => {
        toast.success(`${data.username} joined the chat`);
      });

      newSocket.on('user_left_chat', (data) => {
        toast.info(`${data.username} left the chat`);
      });

      // Call events
      newSocket.on('voice_call_started', (data) => {
        handleVoiceCallStarted(data);
      });

      newSocket.on('voice_call_ended', (data) => {
        handleVoiceCallEnded(data);
      });

      newSocket.on('video_call_started', (data) => {
        handleVideoCallStarted(data);
      });

      newSocket.on('video_call_ended', (data) => {
        handleVideoCallEnded(data);
      });

      // AI processing events
      newSocket.on('ai_message_processed', (data) => {
        handleAIMessageProcessed(data);
      });

      newSocket.on('ai_process_error', (data) => {
        toast.error(data.error || 'AI processing failed');
      });

      // Blockchain events
      newSocket.on('blockchain_transaction_confirmed', (data) => {
        handleBlockchainTransaction(data);
      });

      newSocket.on('blockchain_error', (data) => {
        toast.error(data.error || 'Blockchain transaction failed');
      });

      // Notifications
      newSocket.on('notification', (data) => {
        handleNotification(data);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user, token]);

  // Clean up typing indicators after 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const newTypingUsers = {};
        Object.keys(prev).forEach(chatId => {
          const chatTypingUsers = {};
          Object.keys(prev[chatId]).forEach(userId => {
            if (now - prev[chatId][userId].timestamp < 3000) {
              chatTypingUsers[userId] = prev[chatId][userId];
            }
          });
          if (Object.keys(chatTypingUsers).length > 0) {
            newTypingUsers[chatId] = chatTypingUsers;
          }
        });
        return newTypingUsers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleNewMessage = (data) => {
    // This will be handled by the chat component
    // You can emit a custom event or use a state management solution
    window.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
  };

  const handleMessageSent = (data) => {
    window.dispatchEvent(new CustomEvent('messageSent', { detail: data }));
  };

  const handleMessageRead = (data) => {
    window.dispatchEvent(new CustomEvent('messageRead', { detail: data }));
  };

  const handleVoiceCallStarted = (data) => {
    // Handle incoming voice call
    toast.info(`Incoming voice call from ${data.callerName}`);
    window.dispatchEvent(new CustomEvent('voiceCallStarted', { detail: data }));
  };

  const handleVoiceCallEnded = (data) => {
    window.dispatchEvent(new CustomEvent('voiceCallEnded', { detail: data }));
  };

  const handleVideoCallStarted = (data) => {
    // Handle incoming video call
    toast.info(`Incoming video call from ${data.callerName}`);
    window.dispatchEvent(new CustomEvent('videoCallStarted', { detail: data }));
  };

  const handleVideoCallEnded = (data) => {
    window.dispatchEvent(new CustomEvent('videoCallEnded', { detail: data }));
  };

  const handleAIMessageProcessed = (data) => {
    window.dispatchEvent(new CustomEvent('aiMessageProcessed', { detail: data }));
  };

  const handleBlockchainTransaction = (data) => {
    toast.success('Blockchain transaction confirmed');
    window.dispatchEvent(new CustomEvent('blockchainTransaction', { detail: data }));
  };

  const handleNotification = (data) => {
    toast.info(data.message || 'New notification');
  };

  // Socket methods
  const sendMessage = (chatId, content, messageType = 'text', replyTo = null) => {
    if (socket && connected) {
      socket.emit('send_message', {
        chatId,
        content,
        messageType,
        replyTo
      });
    }
  };

  const startTyping = (chatId) => {
    if (socket && connected) {
      socket.emit('typing_start', { chatId });
    }
  };

  const stopTyping = (chatId) => {
    if (socket && connected) {
      socket.emit('typing_stop', { chatId });
    }
  };

  const markMessageAsRead = (messageId) => {
    if (socket && connected) {
      socket.emit('message_read', { messageId });
    }
  };

  const joinChat = (chatId) => {
    if (socket && connected) {
      socket.emit('join_chat', { chatId });
    }
  };

  const leaveChat = (chatId) => {
    if (socket && connected) {
      socket.emit('leave_chat', { chatId });
    }
  };

  const startVoiceCall = (chatId, callId) => {
    if (socket && connected) {
      socket.emit('voice_call_start', { chatId, callId });
    }
  };

  const endVoiceCall = (chatId, callId) => {
    if (socket && connected) {
      socket.emit('voice_call_end', { chatId, callId });
    }
  };

  const startVideoCall = (chatId, callId) => {
    if (socket && connected) {
      socket.emit('video_call_start', { chatId, callId });
    }
  };

  const endVideoCall = (chatId, callId) => {
    if (socket && connected) {
      socket.emit('video_call_end', { chatId, callId });
    }
  };

  const processAIMessage = (message, options = {}) => {
    if (socket && connected) {
      socket.emit('ai_process_message', { message, options });
    }
  };

  const sendBlockchainTransaction = (type, amount, toAddress) => {
    if (socket && connected) {
      socket.emit('blockchain_transaction', { type, amount, toAddress });
    }
  };

  const value = {
    socket,
    connected,
    typingUsers,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageAsRead,
    joinChat,
    leaveChat,
    startVoiceCall,
    endVoiceCall,
    startVideoCall,
    endVideoCall,
    processAIMessage,
    sendBlockchainTransaction
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
