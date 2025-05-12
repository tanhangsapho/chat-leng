"use client";

import { format } from "date-fns";
import Image from "next/image";
import { Message as MessageType } from "../../types/chat";

interface MessageProps {
  message: MessageType;
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        } max-w-[70%] items-end gap-2`} // Reduced max-width from 80% to 70%
      >
        {!isOwnMessage && (
          <div className="flex-shrink-0">
            <div className="relative h-8 w-8">
              <Image
                src={message.sender.avatar}
                alt={message.sender.name}
                fill
                className="rounded-full object-cover"
              />
              {message.sender.isOnline && (
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
              )}
            </div>
          </div>
        )}

        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-gray-800 rounded-bl-none"
            }`}
          >
            <p className="text-sm">{message.text}</p>
          </div>
          <div
            className={`text-xs text-gray-500 mt-1 ${
              isOwnMessage ? "text-right mr-2" : "text-left ml-2"
            }`}
          >
            {format(message.timestamp, "h:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
