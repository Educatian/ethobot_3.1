import React, { useState } from 'react';
import { SendIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, onLogClick }) => {
  const [text, setText] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('inputPlaceholder')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-alabama-crimson"
          disabled={isLoading}
        />
        <button
          id="send-message-button"
          type="submit"
          disabled={isLoading || !text.trim()}
          onClick={(e) => onLogClick('send-message-button', 'button', e.currentTarget.textContent)}
          className="p-3 rounded-full bg-alabama-crimson text-white hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alabama-crimson disabled:bg-gray-400 disabled:cursor-not-allowed"
          title="Send your message to Ethobot"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <SendIcon className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
