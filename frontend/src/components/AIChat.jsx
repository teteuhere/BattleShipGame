import React, { useState, useEffect, useRef } from 'react';
import { chatWithAI } from '../../api.js';

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

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 w-16 h-16 bg-accent rounded-full shadow-lg flex items-center justify-center text-navy hover:bg-accent/80 transition-transform hover:scale-110 z-50"
        title="Abrir Chat com a IA"
        aria-label="Open AI Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.504 7-5.5S11.996 3 8 3 1 5.504 1 8.5c0 .828.289 1.626.76 2.334.225.26.47.51.742.748zM8 12.5a6.06 6.06 0 0 1-2.061-.475c-.34-.1-.743-.34-1.21-.638-.466-.298-.832-.62-1.09-.922A5.42 5.42 0 0 1 2.5 8.5C2.5 6.57 4.962 5 8 5s5.5 1.57 5.5 3.5S11.038 12.5 8 12.5z"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-light-navy border-2 border-accent/50 rounded-lg shadow-2xl z-50 flex flex-col h-[60vh] max-h-[500px] animate-fade-in">
      <div className="p-4 border-b border-slate/20 flex justify-between items-center cursor-pointer" onClick={() => setMinimized(true)}>
        <span className="text-accent font-bold">Chat com a IA</span>
        <div className="flex gap-2 items-center">
          <button
            onClick={(e) => { e.stopPropagation(); handleClearConversation(); }}
            className="text-slate hover:text-white transition-colors text-sm"
            title="Limpar Conversa"
          >
            Limpar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setMinimized(true); }}
            className="text-white text-2xl hover:text-accent transition-colors"
            title="Minimizar Chat"
          >
            –
          </button>
        </div>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-[85%] ${msg.sender === 'user' ? 'bg-slate/20 ml-auto' : 'bg-navy'}`}>
            <p className="text-sm text-white whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
        {isLoading && <p className="text-sm text-accent animate-pulse">IA está pensando...</p>}
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
    </div>
  );
}

export default AIChat;
