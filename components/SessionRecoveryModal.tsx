import React from 'react';
import { LogoIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SessionRecoveryModalProps {
  onStartNew: () => void;
  onContinue: () => void;
}

const SessionRecoveryModal: React.FC<SessionRecoveryModalProps> = ({ onStartNew, onContinue }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all text-center">
        <div className="flex flex-col items-center">
          <LogoIcon className="h-16 w-16 text-alabama-crimson mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">{t('welcomeBack')}</h2>
          <p className="text-gray-600 mt-3">
            {t('sessionRecoveryPrompt')}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {t('startNewWarning')}
          </p>
        </div>
        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4">
          <button
            onClick={onStartNew}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alabama-crimson"
          >
            {t('startNewSessionButton')}
          </button>
          <button
            onClick={onContinue}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-alabama-crimson hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alabama-crimson"
          >
            {t('continueSessionButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRecoveryModal;
