
import React, { useState, useEffect, useMemo } from 'react';
import type { Message, Challenge, KnowledgeSource } from '../types';
import { BotIcon, UserIcon } from './icons';
import { getChallengeById, getKnowledgeSourceById } from '../services/dataService';
import ChallengeCard from './ChallengeCard';
import ChoiceButtons from './ChoiceButtons';
import KnowledgeCard from './KnowledgeCard';
import { useLanguage } from '../contexts/LanguageContext';
import TypingIndicator from './TypingIndicator';

interface MessageProps {
  message: Message;
  isSending?: boolean;
  onSendMessage: (text: string, fromChoiceButton?: boolean) => void;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

interface ChallengeRendererProps {
  challengeId: string;
  onSendMessage: (text: string, fromChoiceButton?: boolean) => void;
}

const ChallengeRenderer: React.FC<ChallengeRendererProps> = ({ challengeId, onSendMessage }) => {
  const [challenge, setChallenge] = useState<Challenge | null | undefined>(undefined);
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    const fetchChallenge = async () => {
      const data = await getChallengeById(challengeId);
      if (isMounted) {
        setChallenge(data ?? null); // Set to null if not found
      }
    };
    fetchChallenge();
    return () => { isMounted = false; };
  }, [challengeId]);

  if (challenge === undefined) {
    return <div className="text-sm p-2">{t('loadingChallenge')}</div>;
  }

  if (!challenge) {
    return <div className="text-sm p-2 text-red-500">{t('challengeLoadError')} {challengeId}</div>;
  }

  return <ChallengeCard challenge={challenge} onSendMessage={onSendMessage} />;
};

interface KnowledgeRendererProps {
  sourceId: string;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const KnowledgeRenderer: React.FC<KnowledgeRendererProps> = ({ sourceId, onLogClick }) => {
  const [source, setSource] = useState<KnowledgeSource | null | undefined>(undefined);
  const { t } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    const fetchSource = async () => {
      const data = await getKnowledgeSourceById(sourceId);
      if (isMounted) {
        setSource(data ?? null);
      }
    };
    fetchSource();
    return () => { isMounted = false; };
  }, [sourceId]);

  if (source === undefined) {
    return <div className="text-sm p-2">{t('loadingDeepDive')}</div>;
  }

  if (!source) {
    return <div className="text-sm p-2 text-red-500">{t('deepDiveLoadError')} {sourceId}</div>;
  }

  return <KnowledgeCard source={source} onLogClick={onLogClick} />;
};


const Message: React.FC<MessageProps> = ({ message, isSending, onSendMessage, onLogClick }) => {
  const isUser = message.sender === 'user';
  const { t } = useLanguage();

  const { mainText, choices } = useMemo(() => {
    const choiceRegex = /\[CHOICE:(.+?)\]/g;
    const choices = [...message.text.matchAll(choiceRegex)].map(match => match[1]);
    const mainText = message.text.replace(choiceRegex, '').trim();
    return { mainText, choices };
  }, [message.text]);

  const renderContent = (text: string) => {
    const parts = text.split(/(\[CHALLENGE:\w+\]|\[KNOWLEDGE:\w+\])/g);

    return parts.map((part, index) => {
      const challengeMatch = part.match(/\[CHALLENGE:(\w+)\]/);
      if (challengeMatch) {
        const id = challengeMatch[1];
        return <ChallengeRenderer key={`${message.id}-c-${index}`} challengeId={id} onSendMessage={onSendMessage} />;
      }

      const knowledgeMatch = part.match(/\[KNOWLEDGE:(\w+)\]/);
      if (knowledgeMatch) {
        const id = knowledgeMatch[1];
        return <KnowledgeRenderer key={`${message.id}-k-${index}`} sourceId={id} onLogClick={onLogClick} />;
      }

      let formattedPart = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedPart = formattedPart.replace(/\*(.*?)\*/g, '<em>$1</em>');

      return <span key={`${message.id}-t-${index}`} dangerouslySetInnerHTML={{ __html: formattedPart.replace(/\n/g, '<br />') }} />;
    });
  };

  return (
    <div className={`flex items-start gap-4 transition-opacity duration-300 ${isUser ? 'flex-row-reverse' : ''} ${isSending ? 'opacity-60' : 'opacity-100'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-alabama-crimson text-white' : 'bg-gray-200 text-gray-600'}`}>
        {isUser ? <UserIcon className="w-6 h-6" /> : <BotIcon className="w-6 h-6" />}
      </div>
      <div className={`max-w-[85%] sm:max-w-xl ${isUser ? 'text-right' : ''}`}>
        <div className={`rounded-xl p-3 sm:p-4 ${isUser ? 'bg-alabama-crimson text-white' : 'bg-gray-100 text-gray-800'}`}>
          {message.sender === 'bot' && message.text === '...' ? (
            <TypingIndicator />
          ) : (
            <div className="prose prose-sm max-w-none text-inherit">
              {renderContent(mainText)}
            </div>
          )}
        </div>

        {choices.length > 0 && !isUser && (
          <ChoiceButtons choices={choices} onSelect={onSendMessage} />
        )}

        <p className={`text-xs text-gray-400 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {isUser ? t('you') : 'ETHOBOT'} • {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default Message;
