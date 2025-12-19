
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import type { User, Message, ProblemStage, LogEventType } from '../types';
import { STAGES, getInitialBotMessage } from '../constants';
import * as loggingService from '../services/loggingService';
import { toast } from 'react-hot-toast';
// FIX: Import geminiService to resolve "Cannot find name 'geminiService'" errors.
import * as geminiService from '../services/geminiService';

export const useEthobot = (language: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<ProblemStage>(STAGES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatReady, setIsChatReady] = useState(false);

  // Refs for robust logging
  const userRef = useRef<User | null>(null);
  userRef.current = user;
  const sessionStartTimeRef = useRef<number | null>(null);

  // Gemini Initialization effect
  useEffect(() => {
    setIsChatReady(false);
    toast.loading('Initializing AI assistant...', { id: 'init-toast' });
    geminiService.initializeChat(language).then(success => {
      setIsChatReady(success);
      if (success) {
        toast.success('AI assistant is ready!', { id: 'init-toast' });
      } else {
        toast.error("AI assistant could not be initialized.", { id: 'init-toast' });
      }
    });
    // When language changes, reset the chat with the new welcome message
    setMessages([getInitialBotMessage(language)]);
  }, [language]); // Re-initialize when language changes

  // Load user and set up session logger
  useEffect(() => {
    const syncUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const metadata = session.user.user_metadata;
        const newUser = {
          name: metadata.full_name || session.user.email?.split('@')[0] || 'Unknown',
          course: metadata.course || 'General',
          email: session.user.email
        };
        setUser(newUser);
        loggingService.startSession(newUser);
        sessionStartTimeRef.current = Date.now();
      }
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        const metadata = session.user.user_metadata;
        const newUser = {
          name: metadata.full_name || session.user.email?.split('@')[0] || 'User',
          course: metadata.course || 'General',
          email: session.user.email
        };
        setUser(newUser);
        loggingService.startSession(newUser);
        sessionStartTimeRef.current = Date.now();
      } else {
        setUser(null);
      }
    });

    // Session end logger
    const handleBeforeUnload = () => {
      const currentUser = userRef.current;
      if (currentUser && sessionStartTimeRef.current) {
        const sessionDuration = Math.round((Date.now() - sessionStartTimeRef.current) / 1000);
        loggingService.logSessionInfo(currentUser.name, currentUser.course, sessionDuration);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe();
      handleBeforeUnload();
    };
  }, []); // This runs only once

  const isUserActivated = useMemo(() => !!user, [user]);

  const logClickEvent = useCallback((elementId: string, elementTag: string, textContent: string | null, additionalDetails: object = {}) => {
    const eventDetails = {
      elementId,
      elementTag,
      textContent: textContent?.trim(),
      ...additionalDetails,
    };
    loggingService.addLog('ELEMENT_CLICK' as LogEventType.ELEMENT_CLICK, eventDetails);

    loggingService.logClickEvent(
      user?.name || "Guest",
      user?.course || "N/A",
      'ELEMENT_CLICK',
      eventDetails,
      sessionStartTimeRef.current
    );
  }, [user]);

  const activateUser = (name: string, course: string, email: string) => {
    const newUser = { name, course, email };
    setUser(newUser);
    localStorage.setItem('ethobot_user', JSON.stringify(newUser));
    loggingService.startSession(newUser);
    sessionStartTimeRef.current = Date.now();
  };

  const resumeSession = (historicalMessages: Message[], stage?: ProblemStage) => {
    setMessages(historicalMessages);
    setIsChatReady(true);
    if (stage) {
      setCurrentStage(stage);
    }
    toast.success("Session resumed!");
  };

  const sendMessage = useCallback(async (text: string, fromChoiceButton: boolean = false) => {
    if (isLoading || !isChatReady) {
      if (!isChatReady) {
        toast.error("The AI assistant is not ready. Please try again shortly.");
      }
      return;
    }

    if (fromChoiceButton) {
      loggingService.addLog('CHOICE_SELECTED' as LogEventType.CHOICE_SELECTED, { choiceText: text });
      if (user) {
        loggingService.logClickEvent(user.name, user.course, 'CHOICE_SELECTED', { choiceText: text }, sessionStartTimeRef.current);
      }
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    if (fromChoiceButton) {
      await logClickEvent('choice-button', 'button', text);
    }

    const botMessageId = `bot-${Date.now()}`;
    const botMessagePlaceholder: Message = {
      id: botMessageId,
      sender: 'bot',
      text: '...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      const stream = geminiService.streamChat(text, messages.slice(1));

      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => m.id === botMessageId ? { ...m, text: fullResponse + '...' } : m));
      }

      const finalBotMessage: Message = {
        id: botMessageId,
        sender: 'bot',
        text: fullResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => prev.map(m => m.id === botMessageId ? finalBotMessage : m));

      loggingService.addLog('MESSAGE_EXCHANGE' as LogEventType.MESSAGE_EXCHANGE, {
        user: userMessage.text,
        bot: finalBotMessage.text,
        stage: currentStage
      });

      if (user) {
        await loggingService.logUserInteraction(user.name, user.course, userMessage.text, finalBotMessage.text);

        const logObj = {
          logType: 'MESSAGE_EXCHANGE',
          userName: user.name,
          userCourse: user.course,
          userMessage: userMessage.text,
          botResponse: finalBotMessage.text,
          details_json: { sessionId: sessionStartTimeRef.current }
        };
        await loggingService.logToGoogleSheet(logObj);
      }

    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage: Message = {
        id: botMessageId,
        sender: 'bot',
        text: 'Sorry, I encountered an error communicating with the AI. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => prev.map(m => m.id === botMessageId ? errorMessage : m));
      toast.error('An error occurred while communicating with the AI.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, currentStage, isChatReady, user]);

  const downloadData = loggingService.downloadSessionData;

  return {
    user,
    isUserActivated,
    activateUser,
    messages,
    sendMessage,
    currentStage,
    isLoading,
    downloadData,
    logClickEvent,
    resumeSession,
  };
};

export type EthobotHook = ReturnType<typeof useEthobot>;
