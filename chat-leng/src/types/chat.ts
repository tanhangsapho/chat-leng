export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  text: string;
  sender: User;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  lastActivity: Date;
}
