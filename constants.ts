

import { ProblemStage, Message } from './types';

export const STAGES: ProblemStage[] = [
  ProblemStage.PROBLEM_DEFINITION,
  ProblemStage.SOLUTION_EXPLORATION,
  ProblemStage.IMPLEMENTATION,
  ProblemStage.REFLECTION,
];

export const getInitialBotMessage = (language: string): Message => ({
    id: 'ethobot-welcome',
    sender: 'bot',
    text: language === 'ko'
        ? "ETHOBOT에 오신 것을 환영합니다! 저는 안면 인식 기술에 초점을 맞춘 AI 윤리 교육 도우미입니다. 오늘 어떤 안면 인식 윤리 주제를 탐색하고 싶으신가요?"
        : "Welcome to ETHOBOT! I'm your AI Ethics Education Assistant, focused on Facial Recognition technology. What aspect of facial recognition ethics are you interested in exploring today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
});
