import api from './axios';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const agentService = {
  chat: (messages: ChatMessage[]) =>
    api.post<{ reply: string }>('/agent/chat', { messages }).then(r => r.data.reply),
};
