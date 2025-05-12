"use client";

import { User, Conversation } from "../../types/chat";
import Image from "next/image";
import { format } from "date-fns";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SidebarProps {
  conversations: Conversation[];
  currentUser: User;
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentUser,
  activeConversation,
  onSelectConversation,
  className = "",
}) => {
  return (
    <div
      className={`border-r border-gray-200 h-full bg-white flex flex-col ${className}`}
    >
      {" "}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Messages</h1>
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search conversations"
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== currentUser.id
          );
          const lastMessage =
            conversation.messages[conversation.messages.length - 1];

          if (!otherParticipant || !lastMessage) return null;

          const isActive = activeConversation === conversation.id;
          const hasUnread =
            !lastMessage.isRead && lastMessage.sender.id !== currentUser.id;

          return (
            <div
              key={conversation.id}
              className={`p-3 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                isActive ? "bg-blue-50" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src={otherParticipant.avatar}
                  alt={otherParticipant.name}
                  fill
                  className="rounded-full object-cover"
                />
                {otherParticipant.isOnline && (
                  <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`font-medium truncate ${
                      hasUnread ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {otherParticipant.name}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                    {format(lastMessage.timestamp, "h:mm a")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm truncate ${
                      hasUnread ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}
                  >
                    {lastMessage.sender.id === currentUser.id
                      ? `You: ${lastMessage.text}`
                      : lastMessage.text}
                  </p>
                  {hasUnread && (
                    <span className="ml-1.5 flex-shrink-0 h-2 w-2 rounded-full bg-blue-600"></span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* User profile section */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center">
        <div className="relative h-10 w-10 flex-shrink-0">
          <Image
            src={currentUser.avatar}
            alt={currentUser.name}
            fill
            className="rounded-full object-cover"
          />
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            {currentUser.name}
          </p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
