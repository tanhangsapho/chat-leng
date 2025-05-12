"use client";
import { Conversation, currentUser, Message, mockConversations } from "@/types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatContainer, Sidebar } from "./chat";

export default function ChatPage() {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(
    conversations[0]?.id || null
  );

  const handleSendMessage = (text: string) => {
    if (!activeConversation) return;

    const newMessage: Message = {
      id: uuidv4(),
      text,
      sender: currentUser,
      timestamp: new Date(),
      isRead: false,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastActivity: new Date(),
          };
        }
        return conv;
      })
    );
  };

  const currentConversation = conversations.find(
    (c) => c.id === activeConversation
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentUser={currentUser}
        activeConversation={activeConversation}
        onSelectConversation={setActiveConversation}
        className="w-96 flex-shrink-0"
      />
      <ChatContainer
        conversation={currentConversation || null}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
