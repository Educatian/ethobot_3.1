import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import NetworkBackground from './NetworkBackground';

interface ActivationModalProps {
  onActivate: (name: string, course: string) => void;
  onLogClick: (elementId: string, elementTag: string, textContent: string | null) => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ onActivate, onLogClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // After successful login, the App.tsx session listener will trigger.
        // But we still need the name and course if it's the first time or for the session.
        // Usually, name/course would be stored in a profile table, but for now we'll just ask.
        if (name && course) {
          onActivate(name, course);
        } else {
          // If they just logged in, we might need to prompt for name/course if not yet set.
          // For simplicity, we'll assume they fill it all in the first time.
          onActivate(name || email.split('@')[0], course || 'General');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, course: course }
          }
        });
        if (error) throw error;
        toast.success('Registration successful! Please check your email.');
        // If auto-login is enabled in Supabase, the listener will work.
        onActivate(name, course);
      }
    } catch (error: any) {
      toast.error(error.message || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-2 sm:p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <NetworkBackground />

        {/* Tech Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#9E1B32 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

        {/* Floating Ethics Keywords - Refined for Network Vibe */}
        <div className="absolute bottom-[10%] left-[10%] text-alabama-crimson/15 text-3xl font-black uppercase tracking-[0.2em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '30s' }}>Transparency</div>
        <div className="absolute bottom-[20%] right-[15%] text-alabama-crimson/10 text-5xl font-black uppercase tracking-[0.3em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '35s', animationDelay: '5s' }}>Fairness</div>
        <div className="absolute top-[15%] left-[20%] text-alabama-crimson/15 text-2xl font-black uppercase tracking-[0.2em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '25s', animationDelay: '2s' }}>Accountability</div>
        <div className="absolute top-[40%] right-[5%] text-alabama-crimson/10 text-4xl font-black uppercase tracking-[0.2em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '40s', animationDelay: '10s' }}>Justice</div>
        <div className="absolute bottom-[35%] left-[25%] text-alabama-crimson/15 text-3xl font-black uppercase tracking-[0.3em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '32s', animationDelay: '15s' }}>Responsibility</div>
        <div className="absolute top-[25%] right-[20%] text-alabama-crimson/15 text-xl font-black uppercase tracking-[0.2em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '28s', animationDelay: '7s' }}>Human Agency</div>
        <div className="absolute bottom-[15%] right-[30%] text-alabama-crimson/10 text-4xl font-black uppercase tracking-[0.2em] animate-float select-none whitespace-nowrap" style={{ animationDuration: '38s', animationDelay: '18s' }}>Privacy</div>
      </div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 min-h-[500px] lg:h-[650px]">

        {/* Left Side: Hero Area */}
        <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-alabama-crimson to-crimson-dark text-white relative h-full">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-white p-2 rounded-3xl shadow-2xl mb-10 transform hover:scale-110 transition-transform duration-500 ring-4 ring-white/20">
              <img src="/ethobot_logo.jpg" alt="Ethobot Logo" className="h-48 w-48 lg:h-56 lg:w-56 object-contain rounded-2xl" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">ETHOBOT</h1>
            <div className="w-16 h-1 bg-white/40 mb-6 rounded-full"></div>
            <p className="text-xl text-white/90 font-medium max-w-sm">
              {t('aboutSubtitle') || 'AI Ethics Education Assistant'}
            </p>
            <div className="mt-12 space-y-4 text-left w-full max-w-xs text-sm text-white/80">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Explore AI Ethics Case Studies</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Guided Critical Thinking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span>Personalized Learning Feedback</span>
              </div>
            </div>
          </div>

          {/* Language Switchers at Bottom */}
          <div className="absolute bottom-8 flex space-x-4 z-10">
            <button
              onClick={() => {
                onLogClick('landing-lang-en', 'button', 'English');
                setLanguage('en');
              }}
              className={`text-sm font-medium transition-all ${language === 'en' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white'}`}
              title="Switch language to English"
            >
              English
            </button>
            <button
              onClick={() => {
                onLogClick('landing-lang-ko', 'button', '한국어');
                setLanguage('ko');
              }}
              className={`text-sm font-medium transition-all ${language === 'ko' ? 'text-white border-b-2 border-white pb-1' : 'text-white/60 hover:text-white'}`}
              title="Switch language to Korean"
            >
              한국어
            </button>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 bg-white relative h-full overflow-y-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 ring-2 ring-alabama-crimson/5">
              <img src="/ethobot_logo.jpg" alt="Ethobot Logo" className="h-24 w-24 sm:h-32 sm:w-32 object-contain rounded-xl" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isLogin ? t('loginHeader') : t('signupHeader')}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
              <button
                onClick={() => {
                  onLogClick('auth-mode-toggle', 'button', isLogin ? 'Go to Register' : 'Go to Login');
                  setIsLogin(!isLogin);
                }}
                className="text-alabama-crimson font-semibold hover:underline"
                title={isLogin ? "Go to registration page" : "Go to login page"}
              >
                {isLogin ? t('signUp') : t('signIn')}
              </button>
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4" id="auth-form">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('fullNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alabama-crimson/50 focus:border-alabama-crimson transition-all"
                    placeholder={t('fullNamePlaceholder')}
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    {t('courseNumberLabel')}
                  </label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alabama-crimson/50 focus:border-alabama-crimson transition-all"
                    placeholder={t('courseNumberPlaceholder')}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                {t('emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alabama-crimson/50 focus:border-alabama-crimson transition-all"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block text-left">
                {t('passwordLabel')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alabama-crimson/50 focus:border-alabama-crimson transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              onClick={(e) => onLogClick('auth-submit-button', 'button', isLogin ? 'Sign In' : 'Sign Up')}
              className="w-full py-4 bg-alabama-crimson text-white font-bold rounded-xl shadow-lg hover:bg-crimson-dark transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              title={isLogin ? "Sign in to your account" : "Create your new account"}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Signing In...' : 'Signing Up...'}</span>
                </div>
              ) : (
                isLogin ? t('signInButton') : t('signUpButton')
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                Education Research Project
              </p>
              {/* Mobile Language Switchers */}
              <div className="lg:hidden flex space-x-4">
                <button
                  onClick={() => {
                    onLogClick('landing-lang-en-mobile', 'button', 'English');
                    setLanguage('en');
                  }}
                  className={`text-xs ${language === 'en' ? 'text-alabama-crimson font-bold' : 'text-gray-400'}`}
                  title="Switch to English"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    onLogClick('landing-lang-ko-mobile', 'button', '한국어');
                    setLanguage('ko');
                  }}
                  className={`text-xs ${language === 'ko' ? 'text-alabama-crimson font-bold' : 'text-gray-400'}`}
                  title="Switch to Korean"
                >
                  한국어
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;