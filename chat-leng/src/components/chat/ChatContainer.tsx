"use client";

import { useRef, useEffect } from "react";
import { Conversation, User } from "../../types/chat";
import Message from "./Message";
import ChatInput from "./ChatInput";
import Image from "next/image";
import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ChatContainerProps {
  conversation: Conversation | null;
  currentUser: User;
  onSendMessage: (text: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  conversation,
  currentUser,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No conversation selected
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participants.find(
    (p) => p.id !== currentUser.id
  );

  if (!otherParticipant) return null;

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src={otherParticipant.avatar}
              alt={otherParticipant.name}
              fill
              className="rounded-full object-cover"
            />
            {otherParticipant.isOnline && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
            )}
          </div>
          <div>
            <h2 className="font-medium text-gray-900">
              {otherParticipant.name}
            </h2>
            <p className="text-xs text-gray-500">
              {otherParticipant.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-500 hover:text-gray-700">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {conversation?.messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.sender.id === currentUser.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatContainer;
