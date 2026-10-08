import axios from 'axios';

// Instance séparée : le chatbot tourne sur FastAPI (8000), pas sur NestJS (3000)
const chatbotApi = axios.create({
  baseURL: import.meta.env.VITE_CHATBOT_API_URL ?? 'http://localhost:8000',
  timeout: 40000, // un peu plus que le timeout de 30 s du backend
});

export interface ChatResponse {
  conversation_id: string;
  reply: string;
}

export const chatbotService = {
  sendMessage: (message: string, conversationId: string | null) =>
    chatbotApi
      .post<ChatResponse>('/chat', { message, conversation_id: conversationId })
      .then(r => r.data),

  resetConversation: (conversationId: string) =>
    chatbotApi.delete(`/chat/${conversationId}`),
};

// Transforme une erreur technique en message compréhensible pour l'utilisateur
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Pas de réponse du tout = serveur FastAPI éteint ou injoignable
    if (!error.response) {
      return 'Pawly est injoignable pour le moment. Vérifiez votre connexion puis réessayez.';
    }
    // 422 = refusé par Pydantic (message vide ou trop long)
    if (error.response.status === 422) {
      return 'Votre message est vide ou trop long (2000 caractères maximum).';
    }
    // 502 / 503 / 504 : on affiche le message écrit dans main.py (HTTPException)
    const detail = error.response.data?.detail;
    if (typeof detail === 'string') return detail;
  }
  return 'Une erreur inattendue est survenue. Réessayez.';
}
