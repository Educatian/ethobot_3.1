
import React, { useState } from 'react';
import type { Challenge } from '../types';
import { DilemmaIcon, CheckCircleIcon } from './icons';

interface ChallengeCardProps {
  challenge: Challenge;
  onSendMessage: (text: string, fromChoiceButton: boolean) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onSendMessage }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const isCompleted = selectedOption !== null;

  const handleClick = (index: number) => {
    if (isCompleted) return;

    setSelectedOption(index);
    onSendMessage(challenge.options[index].text, true);
  };

  const getButtonClass = (index: number) => {
    let baseClass = 'w-full text-left bg-white border text-gray-700 px-4 py-2 rounded-md transition-colors flex items-center justify-between';

    if (!isCompleted) {
      return `${baseClass} border-gray-300 hover:bg-gray-50 hover:border-alabama-crimson`;
    }

    if (selectedOption === index) {
      return `${baseClass} border-alabama-crimson bg-crimson-light/50 ring-2 ring-alabama-crimson/50 cursor-not-allowed`;
    }

    return `${baseClass} border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed`;
  };

  return (
    <div className="mt-4 mb-2 border border-alabama-crimson/30 bg-crimson-light/50 rounded-lg p-4 text-gray-800">
      <div className="flex items-center mb-3">
        <DilemmaIcon className="h-6 w-6 text-alabama-crimson mr-3" />
        <div>
          <p className="text-xs font-semibold uppercase text-alabama-crimson">{challenge.type}</p>
          <h4 className="font-bold text-gray-900">{challenge.title}</h4>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-4">{challenge.description}</p>
      <div className="flex flex-col space-y-2">
        {challenge.options.map((option, index) => (
          <div key={index}>
            <button
              onClick={() => handleClick(index)}
              disabled={isCompleted}
              className={getButtonClass(index)}
              title={isCompleted ? "You have already submitted a response" : "Select this option to submit your response"}
            >
              <span>{option.text}</span>
              {selectedOption === index && <CheckCircleIcon className="h-5 w-5 text-alabama-crimson" />}
            </button>
            {selectedOption === index && option.feedback && (
              <div className="mt-[-1px] p-3 pt-4 bg-white/80 rounded-b-md text-sm text-gray-800 border-l border-r border-b border-alabama-crimson/50">
                <p className="font-semibold text-alabama-crimson">Feedback</p>
                <p className="mt-1">{option.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengeCard;
