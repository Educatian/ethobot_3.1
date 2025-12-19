
import React, { useRef, useEffect, useMemo } from 'react';
import type { Message as MessageType } from '../types';
import Message from './Message';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (text: string, fromChoiceButton?: boolean) => void;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage, onLogClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const lastUserMessageIndex = useMemo(() =>
    messages.map(m => m.sender).lastIndexOf('user'),
    [messages]
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div id="chat-messages" className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <Message
            key={msg.id}
            message={msg}
            isSending={isLoading && msg.sender === 'user' && index === lastUserMessageIndex}
            onSendMessage={onSendMessage}
            onLogClick={onLogClick}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={onSendMessage} isLoading={isLoading} onLogClick={onLogClick} />
    </div>
  );
};

export default ChatWindow;
