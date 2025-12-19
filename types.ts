

export interface User {
  name: string;
  course: string;
  email?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export enum ProblemStage {
  PROBLEM_DEFINITION = 'Problem Definition',
  SOLUTION_EXPLORATION = 'Solution Exploration',
  IMPLEMENTATION = 'Implementation',
  REFLECTION = 'Reflection',
}

export enum ChallengeType {
  DILEMMA = 'Ethical Dilemma',
  PERSPECTIVE = 'Perspective Taking',
  MYSTERY = 'Case Study Mystery',
  POLL = 'Ethics Poll',
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  options: { text: string; feedback?: string }[];
}

export interface KnowledgeSource {
  id: string;
  title: string;
  summary: string;
  url: string;
  youtubeUrl?: string;
  blogUrl?: string;
}

export enum LogEventType {
  SESSION_START = 'SESSION_START',
  MESSAGE_EXCHANGE = 'MESSAGE_EXCHANGE',
  CHOICE_SELECTED = 'CHOICE_SELECTED',
  ELEMENT_CLICK = 'ELEMENT_CLICK',
}

export interface LogEvent {
  type: LogEventType;
  timestamp: string;
  details: any;
}

export interface SessionLog {
  studentInfo: User;
  events: LogEvent[];
}
