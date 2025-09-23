import React, { useState, useEffect, useRef } from 'react'; // Importe `useRef`
import { chatWithAI } from '../../api.js';

// Onde a última mensagem do chat será renderizada.
// Rola a tela para a última mensagem toda vez que uma nova é adicionada.

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minimized, setMinimized] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (message) => {
    setIsLoading(true);
    setMessages(prev => [...prev, { text: message, sender: 'user' }]);

    try {
      const aiResponse = await chatWithAI(message);
      setMessages(prev => [...prev, { text: aiResponse.response, sender: 'ai' }]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setMessages(prev => [...prev, { text: "Erro: Não foi possível conectar com a IA.", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    handleSendMessage(input);
    setInput('');
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  return (
    <div className={`fixed bottom-4 right-4 w-80 bg-light-navy border-2 border-accent/50 rounded-lg shadow-2xl z-50 flex flex-col transition-all duration-300 ${minimized ? 'h-16' : 'h-96'}`}>
      <div className="p-4 border-b border-slate/20 flex justify-between items-center">
        <span className="text-accent font-bold">Chat com a IA</span>
        <div className="flex gap-2">
          {!minimized && (
            <button
              onClick={handleClearConversation}
              className="text-slate hover:text-white transition-colors text-sm"
              title="Limpar Conversa"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-white text-lg hover:text-accent transition-colors"
            title={minimized ? "Maximizar Chat" : "Minimizar Chat"}
          >
            {minimized ? '+' : '–'}
          </button>
        </div>
      </div>
      
      {!minimized && (
        <>
          <div className="flex-grow p-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-slate/20 ml-auto' : 'bg-navy'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
            {isLoading && <p className="text-sm text-accent animate-pulse">IA está pensando...</p>}
            {}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate/20">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo..."
              className="w-full p-2 rounded-md bg-navy text-white border border-slate/50 focus:outline-none focus:border-accent"
              disabled={isLoading}
            />
          </form>
        </>
      )}
    </div>
  );
}

export default AIChat;