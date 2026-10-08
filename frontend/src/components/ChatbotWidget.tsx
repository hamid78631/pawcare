import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Info, MessageCircle, PawPrint, RotateCcw, Send, X } from 'lucide-react';
import { chatbotService, getErrorMessage } from '../api/chatbotService';
import './ChatbotWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Bonjour, je suis **Pawly** 🐾, l'assistant pet sitting de PawCare.\n\n" +
    'Je peux vous aider à **préparer la garde** de votre animal, **choisir un sitter** ' +
    "ou, si vous êtes sitter, **bien vous occuper** d'un animal confié. Que puis-je faire pour vous ?",
};

const LIMITS = [
  'Je réponds uniquement aux questions sur la garde et le bien-être des animaux.',
  'Je ne pose aucun diagnostic vétérinaire et ne recommande aucun médicament.',
  "En cas d'urgence, contactez immédiatement un vétérinaire.",
  "Je n'ai pas accès aux profils des sitters ni à vos réservations.",
  'Je peux me tromper : vérifiez les informations importantes.',
  "N'indiquez pas de données personnelles sensibles.",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLimits, setShowLimits] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Défile automatiquement vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return; // on ne laisse pas partir un message vide

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      // 1er message : conversationId = null → FastAPI en crée un et nous le renvoie
      const data = await chatbotService.sendMessage(text, conversationId);
      setConversationId(data.conversation_id);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    if (conversationId) {
      try {
        await chatbotService.resetConversation(conversationId);
      } catch {
        // Pas bloquant : côté interface, on repart de zéro quoi qu'il arrive
      }
    }
    setConversationId(null);
    setMessages([WELCOME_MESSAGE]);
    setError(null);
    setShowLimits(false);
  };

  return (
    <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
      {isOpen && (
        <section className="chatbot__panel" aria-label="Pawly, assistant pet sitting">
          <header className="chatbot__header">
            <div className="chatbot__identity">
              <span className="chatbot__avatar">
                <PawPrint size={18} />
              </span>
              <div>
                <strong>Pawly</strong>
                <small>Assistant pet sitting</small>
              </div>
            </div>
            <div className="chatbot__actions">
              <button
                onClick={() => setShowLimits(v => !v)}
                title="Limites d'utilisation"
                aria-label="Limites d'utilisation"
              >
                <Info size={18} />
              </button>
              <button
                onClick={handleNewConversation}
                disabled={isLoading}
                title="Nouvelle conversation"
                aria-label="Nouvelle conversation"
              >
                <RotateCcw size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} title="Fermer" aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
          </header>

          {showLimits && (
            <div className="chatbot__limits">
              <h3>Ce que Pawly ne fait pas</h3>
              <ul>
                {LIMITS.map(limit => (
                  <li key={limit}>{limit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="chatbot__messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot__bubble chatbot__bubble--${m.role}`}>
                {m.role === 'assistant' ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
              </div>
            ))}

            {isLoading && (
              <div
                className="chatbot__bubble chatbot__bubble--assistant chatbot__typing"
                aria-label="Pawly écrit..."
              >
                <span />
                <span />
                <span />
              </div>
            )}

            {error && (
              <div className="chatbot__error" role="alert">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot__form" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Posez votre question sur la garde..."
              maxLength={2000}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Envoyer">
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        className="chatbot__toggle"
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Fermer Pawly' : 'Ouvrir Pawly'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
