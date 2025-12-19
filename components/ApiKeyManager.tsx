import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, KeyIcon } from './icons';

interface ApiKeyManagerProps {
  apiKey: string | null;
  isApiKeyValid: boolean;
  onSave: (key: string) => Promise<void>;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ apiKey, isApiKeyValid, onSave, onLogClick }) => {
  const [keyInput, setKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setKeyInput(apiKey);
    }
  }, [apiKey]);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    onLogClick('save-api-key-button', 'button', e.currentTarget.textContent);
    setIsSaving(true);
    await onSave(keyInput);
    setIsSaving(false);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800">API Key</h2>
      <p className="text-sm text-gray-500 mt-1">
        Your Google Gemini API key is stored locally and never sent to our servers.
      </p>
      <div className="mt-4 flex items-center relative">
        <KeyIcon className="h-5 w-5 text-gray-400 absolute left-3" />
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          placeholder="Enter your AIza... key"
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-alabama-crimson focus:border-alabama-crimson"
        />
        {apiKey && (
            isApiKeyValid 
            ? <CheckCircleIcon className="h-6 w-6 text-green-500 absolute right-3" /> 
            : <XCircleIcon className="h-6 w-6 text-red-500 absolute right-3" />
        )}
      </div>
      <button
        id="save-api-key-button"
        onClick={handleSave}
        disabled={isSaving || !keyInput}
        className="w-full mt-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-alabama-crimson hover:bg-crimson-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alabama-crimson disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Validating...' : 'Save API Key'}
      </button>
    </div>
  );
};

export default ApiKeyManager;