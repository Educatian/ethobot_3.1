import React from 'react';
import { LogoIcon, XMarkIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutEthobotProps {
    isOpen: boolean;
    onClose: () => void;
    onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const AboutEthobot: React.FC<AboutEthobotProps> = ({ isOpen, onClose, onLogClick }) => {
    const { t } = useLanguage();
    if (!isOpen) return null;

    const handleClose = () => {
        onLogClick('about-modal-close-button', 'button', 'Close');
        onClose();
    }

    return (
        <div
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
            onClick={handleClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full m-4 transform transition-all text-gray-800"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-12 w-12 text-alabama-crimson" />
                        <div>
                            <h2 className="text-2xl font-bold">{t('aboutTitle')}</h2>
                            <p className="text-gray-500">{t('aboutSubtitle')}</p>
                        </div>
                    </div>
                    <button id="about-modal-close-button" onClick={handleClose} className="text-gray-400 hover:text-gray-600" title="Close information panel">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-6 text-sm max-h-[70vh] overflow-y-auto pr-4">
                    <section>
                        <h3 className="text-lg font-semibold text-alabama-crimson mb-2">{t('purposeAndModel')}</h3>
                        <p>
                            {t('purposeText')}
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>{t('pedagogy1')}</li>
                            <li>{t('pedagogy2')}</li>
                            <li>{t('pedagogy3')}</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-alabama-crimson mb-2">{t('keyFeatures')}</h3>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                            <li>
                                <strong>{t('feature1').split(':')[0]}:</strong>
                                {t('feature1').split(':').slice(1).join(':')}
                            </li>
                            <li>
                                <strong>{t('feature2').split(':')[0]}:</strong>
                                {t('feature2').split(':').slice(1).join(':')}
                            </li>
                            <li>
                                <strong>{t('feature3').split(':')[0]}:</strong>
                                {t('feature3').split(':').slice(1).join(':')}
                            </li>
                            <li>
                                <strong>{t('feature4').split(':')[0]}:</strong>
                                {t('feature4').split(':').slice(1).join(':')}
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold text-alabama-crimson mb-2">{t('privacyAndSecurity')}</h3>
                        <p>
                            {t('privacyText')}
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutEthobot;
