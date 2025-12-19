import React, { useState } from 'react';
import { ChoiceIcon } from './icons';

interface ChoiceButtonsProps {
  choices: string[];
  onSelect: (choice: string, fromChoiceButton: boolean) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, onSelect }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelect = (choice: string) => {
    if (isCompleted) return;
    setIsCompleted(true);
    onSelect(choice, true);
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => handleSelect(choice)}
          disabled={isCompleted}
          className={`flex items-center text-sm bg-white border text-gray-700 px-3 py-1.5 rounded-full transition-colors ${
            isCompleted
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 hover:bg-gray-50 hover:border-alabama-crimson hover:text-alabama-crimson'
          }`}
        >
          <ChoiceIcon className="h-4 w-4 mr-2" />
          {choice}
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;