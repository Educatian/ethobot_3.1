
import React, { useState } from 'react';
import type { EthobotHook } from '../hooks/useEthobot';
import ProgressBar from './ProgressBar';
import ChatWindow from './ChatWindow';
import { LogoIcon, InformationCircleIcon, ArrowDownTrayIcon } from './icons';
import AboutEthobot from './AboutEthobot';
import AccountModal from './AccountModal';
import { useLanguage } from '../contexts/LanguageContext';
import { UserCircle, Menu, X as CloseIcon } from 'lucide-react';

interface ChatLayoutProps {
  ethobot: EthobotHook;
  onLogout: () => void;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ ethobot, onLogout }) => {
  const {
    user, currentStage, messages, sendMessage, isLoading,
    downloadData, logClickEvent
  } = ethobot;
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isAccountVisible, setIsAccountVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex h-screen w-screen relative overflow-hidden bg-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex-shrink-0 w-80 bg-gray-100 border-r border-gray-200 p-6 flex flex-col
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <img src="/ethobot_logo.jpg" alt="Ethobot" className="h-10 w-10 rounded-lg shadow-sm" />
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">ETHOBOT</h1>
          </div>
          <button
            onClick={() => {
              logClickEvent('sidebar-close-button', 'button', 'Close Sidebar');
              setIsSidebarOpen(false);
            }}
            className="p-2 lg:hidden text-gray-500 hover:text-alabama-crimson"
            title="Close sidebar"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <div className="flex-grow">
          <div className="bg-crimson-light p-4 rounded-xl border border-alabama-crimson/10 mb-6">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2">{t('studentInfo')}</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-400 text-[10px] uppercase mr-1">{t('nameLabel')}:</span> {user?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-400 text-[10px] uppercase mr-1">{t('courseLabel')}:</span> {user?.course}
              </p>
            </div>
          </div>
        </div>
        <footer className="text-[10px] text-gray-400 text-center pt-4 uppercase tracking-widest font-bold border-t border-gray-200">
          <button
            id="about-ethobot-button"
            onClick={(e) => {
              logClickEvent('about-ethobot-button', 'button', e.currentTarget.textContent);
              setIsAboutVisible(true);
              setIsSidebarOpen(false);
            }}
            className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-alabama-crimson transition-colors mb-3 font-medium"
            title="View information about Ethobot"
          >
            <InformationCircleIcon className="w-4 h-4 mr-2" />
            {t('aboutEthobot')}
          </button>
          <button
            id="download-data-button"
            onClick={(e) => {
              logClickEvent('download-data-button', 'button', e.currentTarget.textContent);
              downloadData();
              setIsSidebarOpen(false);
            }}
            className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-alabama-crimson transition-colors mb-4 font-medium"
            title="Export your activity data as JSON"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            {t('downloadData')}
          </button>
          <p>{t('copyright')}</p>
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        <header className="p-3 lg:p-4 border-b border-gray-200 bg-white flex justify-between items-center gap-2 lg:gap-4 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                logClickEvent('sidebar-open-button', 'button', 'Open Sidebar');
                setIsSidebarOpen(true);
              }}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block min-w-[120px] md:min-w-[200px] lg:min-w-[300px]">
              <ProgressBar currentStage={currentStage} />
            </div>
          </div>

          <div className="flex items-center space-x-1.5 lg:space-x-2 flex-shrink-0">
            <div className="flex bg-gray-100 p-1 rounded-lg mr-1 lg:mr-2">
              <button
                onClick={() => {
                  logClickEvent('language-switch-en', 'button', 'English');
                  setLanguage('en');
                }}
                className={`px-2 py-1 text-[10px] lg:text-xs rounded-md transition-all ${language === 'en' ? 'bg-white text-alabama-crimson shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                title="Switch interface to English"
              >
                EN
              </button>
              <button
                onClick={() => {
                  logClickEvent('language-switch-ko', 'button', 'Korean');
                  setLanguage('ko');
                }}
                className={`px-2 py-1 text-[10px] lg:text-xs rounded-md transition-all ${language === 'ko' ? 'bg-white text-alabama-crimson shadow-sm font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                title="Switch interface to Korean"
              >
                KO
              </button>
            </div>
            <button
              id="account-button"
              onClick={() => {
                logClickEvent('account-button', 'button', 'Account');
                setIsAccountVisible(true);
              }}
              className="flex items-center space-x-1.5 px-2 py-1.5 lg:px-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-all shadow-sm group"
              title="View your learning history and profile"
            >
              <UserCircle size={18} className="text-alabama-crimson group-hover:scale-110 transition-transform" />
              <span className="text-xs lg:text-sm font-bold hidden xs:inline">{t('account')}</span>
            </button>
          </div>
        </header>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={sendMessage}
          onLogClick={logClickEvent}
        />
      </main>

      <AboutEthobot isOpen={isAboutVisible} onClose={() => setIsAboutVisible(false)} onLogClick={logClickEvent} />
      <AccountModal isOpen={isAccountVisible} user={user} onClose={() => setIsAccountVisible(false)} onLogout={onLogout} onResumeSession={ethobot.resumeSession} onLogClick={logClickEvent} />
    </div >
  );
};

export default ChatLayout;
