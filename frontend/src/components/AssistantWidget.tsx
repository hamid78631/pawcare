import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, PawPrint } from 'lucide-react';
import { agentService, type ChatMessage } from '../api/agentService';
import './AssistantWidget.css';

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Bonjour ! Je suis l'assistant PawCare 🐾 Je peux vous aider à trouver un sitter, répondre à vos questions sur la plateforme, ou vous aider à réserver une garde. Comment puis-je vous aider ?",
};

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const nextMessages = [...messages, { role: 'user', content: trimmed } as ChatMessage];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await agentService.chat(nextMessages);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Désolé, une erreur est survenue. Réessayez plus tard.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assistant-widget">
      {isOpen && (
        <div className="assistant-widget__panel">
          <div className="assistant-widget__header">
            <div className="assistant-widget__header-title">
              <PawPrint size={18} />
              Assistant PawCare
            </div>
            <button className="assistant-widget__close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="assistant-widget__messages">
            {messages.map((m, i) => (
              <div key={i} className={`assistant-widget__bubble assistant-widget__bubble--${m.role}`}>
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="assistant-widget__bubble assistant-widget__bubble--assistant assistant-widget__bubble--loading">
                <span className="assistant-widget__dot" />
                <span className="assistant-widget__dot" />
                <span className="assistant-widget__dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="assistant-widget__input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Écrivez votre message..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      <button className="assistant-widget__toggle" onClick={() => setIsOpen(v => !v)}>
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
