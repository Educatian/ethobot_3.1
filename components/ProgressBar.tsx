
import React from 'react';
import { ProblemStage } from '../types';
import { STAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ProgressBarProps {
  currentStage: ProblemStage;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);
  const { t } = useLanguage();

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 mb-2">
        {t('learningStage')}: <span className="text-alabama-crimson">{currentStage}</span>
      </h3>
      <div className="flex space-x-1">
        {STAGES.map((stage, index) => (
          <div key={stage} className="flex-1 h-2 rounded-full" >
            <div className={`h-full rounded-full transition-all duration-500 ${index <= currentIndex ? 'bg-alabama-crimson' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
