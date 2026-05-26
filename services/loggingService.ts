import type { User, LogEvent, LogEventType, SessionLog } from '../types';
import { supabase } from './supabaseClient';

let sessionLog: SessionLog | null = null;
const SHEETS_API_URL = 'https://sheets-api-function-515497328571.europe-west1.run.app/';

/**
 * Emits a structured log to the console in JSON format.
 * This is useful for environments like Google Cloud Run that can parse structured logs.
 * @param severity The severity of the log message.
 * @param payload The JSON payload of the log.
 */
const structuredLog = (severity: 'INFO' | 'WARNING' | 'ERROR', payload: object) => {
  const logData = {
    severity,
    timestamp: new Date().toISOString(),
    ...payload
  };
  console.log(JSON.stringify(logData));
};

/**
 * Logs a user interaction (a message exchange between user and chatbot).
 */
export const logUserInteraction = async (userFullName: string, course: string, userMessage: string, chatbotMessage: string) => {
  structuredLog('INFO', {
    eventType: 'MESSAGE_EXCHANGE',
    userFullName,
    course,
    userMessage,
    chatbotMessage,
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          user_id: user?.id,
          user_name: userFullName,
          course: course,
          user_message: userMessage,
          bot_response: chatbotMessage,
          timestamp: new Date().toISOString()
        },
      ]);

    if (error) throw error;
    console.log('[SUPABASE LOG] Successfully logged message exchange.');
  } catch (err) {
    console.error('[SUPABASE LOG] Failed to log message exchange:', err);
  }
};

/**
 * Logs a user click event to the console and sends it to a remote server.
 */
export const logClickEvent = async (userFullName: string, course: string, eventType: string, eventData: object, sessionId: number | null) => {
  structuredLog('INFO', {
    eventType,
    userFullName,
    course,
    eventData,
  });

  const logData = {
    logType: eventType,
    userName: userFullName,
    userCourse: course,
    userMessage: null,
    botResponse: null,
    details_json: { ...eventData, sessionId }
  };

  // Parallel logging to Google Sheets and Supabase
  try {
    const { data: { user } } = await supabase.auth.getUser();

    await Promise.all([
      logToGoogleSheet(logData),
      (async () => {
        try {
          const { error } = await supabase
            .from('activity_logs')
            .insert([
              {
                user_id: user?.id,
                user_name: userFullName,
                course: course,
                event_type: eventType,
                details_json: { ...eventData, sessionId },
                timestamp: new Date().toISOString()
              },
            ]);
          if (error) throw error;
          console.log('[SUPABASE LOG] Successfully logged click event.');
        } catch (err) {
          console.error('[SUPABASE LOG] Failed to log click event to Supabase:', err);
        }
      })()
    ]);
  } catch (err) {
    console.error('[LOG SERVICE] Error getting user for logging:', err);
    // Still try to log to Google Sheet even if Supabase user fails
    logToGoogleSheet(logData);
  }
};

/**
 * Logs summary information about a user session.
 * @param userFullName The full name of the user.
 * @param course The course the user is enrolled in.
 * @param sessionDuration The total duration of the session in seconds.
 */
export const logSessionInfo = (userFullName: string, course: string, sessionDuration: number) => {
  structuredLog('INFO', {
    eventType: 'SESSION_INFO',
    userFullName,
    course,
    sessionDuration,
  });
};

/**
 * Sends a generic log object to the Google Sheets logging endpoint.
 * @param logObj The log object to send.
 */
export const logToGoogleSheet = async (logObj: object) => {
  try {
    await fetch(SHEETS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logObj)
    });
    console.log('[SERVER LOG] Successfully sent log to Google Sheet.');
  } catch (error) {
    console.error('[SERVER LOG] Failed to send log to Google Sheet:', error);
  }
};

// --- Local Session Management for Data Download Feature ---

export const startSession = (user: User) => {
  sessionLog = {
    studentInfo: user,
    events: [],
  };
  addLog('SESSION_START' as LogEventType.SESSION_START, { user });
};

export const addLog = (type: LogEventType, details: any) => {
  if (!sessionLog) return;
  const event: LogEvent = {
    type,
    timestamp: new Date().toISOString(),
    details,
  };
  sessionLog.events.push(event);
};

export const getSessionData = (): SessionLog | null => {
  return sessionLog;
};

export const downloadSessionData = () => {
  if (!sessionLog) {
    alert("No session data to download.");
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessionLog, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  const fileName = `ethobot_session_${sessionLog.studentInfo.name.replace(/\s/g, '_')}_${new Date().toISOString()}.json`;
  downloadAnchorNode.setAttribute("download", fileName);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export const clearLocalSession = () => {
  localStorage.removeItem('ethobot_user');
  sessionLog = null;
};

/**
 * Fetches all persistent history for the currently authenticated user from Supabase.
 */
export const fetchUserHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const [messagesRes, activityRes] = await Promise.all([
      supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true }),
      supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true })
    ]);

    if (messagesRes.error) throw messagesRes.error;
    if (activityRes.error) throw activityRes.error;

    return {
      messages: messagesRes.data,
      activity: activityRes.data
    };
  } catch (err) {
    console.error('[SUPABASE] Failed to fetch user history:', err);
    throw err;
  }
};
