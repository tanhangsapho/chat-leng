import { Conversation, User } from "./chat";

const currentUser: User = {
  id: "user1",
  name: "You",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  isOnline: true,
};

const mockUsers: User[] = [
  {
    id: "user2",
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isOnline: true,
  },
  {
    id: "user3",
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    isOnline: false,
  },
  {
    id: "user4",
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    isOnline: true,
  },
];

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [currentUser, mockUsers[0]],
    messages: [
      {
        id: "msg1",
        text: "Hey there! How's your project coming along?",
        sender: mockUsers[0],
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
      },
      {
        id: "msg2",
        text: "It's going well! Just finishing up the UI design.",
        sender: currentUser,
        timestamp: new Date(Date.now() - 3500000),
        isRead: true,
      },
      {
        id: "msg3",
        text: "That's great! Can't wait to see it.",
        sender: mockUsers[0],
        timestamp: new Date(Date.now() - 3400000),
        isRead: true,
      },
    ],
    lastActivity: new Date(Date.now() - 3400000),
  },
  // Add more mock conversations as needed
];

export { mockConversations, mockUsers, currentUser };
