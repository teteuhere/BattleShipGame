// BattleShipGame/frontend/src/components/NameEntryScreen.jsx

import React, { useState } from 'react';

function NameEntryScreen({ gameMode, onNamesSubmitted }) {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const isPvp = gameMode === 'pvp';

  // This will check if the button should be enabled
  const isButtonDisabled = isPvp ? !player1Name || !player2Name : !player1Name;

  const handleSubmit = (e) => {
    e.preventDefault();
    // This check is a fallback, but the button being disabled is the main guard
    if (isButtonDisabled) return; 
    
    onNamesSubmitted({
      player1: player1Name, // No need for a fallback here anymore
      player2: isPvp ? player2Name : null,
    });
  };

  return (
    <div className="flex flex-col items-center animate-fade-in text-center">
      <h2 className="text-3xl text-accent mb-6">Comandante, identifique-se!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
        {/* Input do Jogador 1 */}
        <div className="flex flex-col">
          <label htmlFor="player1" className="text-slate mb-2 text-lg">
            {isPvp ? 'Dogtag do Comandante - 1' : 'Dogtag do Comandante'}
          </label>
          <input
            id="player1"
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            placeholder="Digite o nome..."
            className="bg-light-navy text-white p-3 rounded-md border-2 border-slate/50 focus:border-accent focus:outline-none"
            autoFocus
            required // Add required attribute for better accessibility
          />
        </div>

        {/* Input do Jogador 2 (apenas para PvP) */}
        {isPvp && (
          <div className="flex flex-col">
            <label htmlFor="player2" className="text-slate mb-2 text-lg">
              Dogtag do Comandante - 2
            </label>
            <input
              id="player2"
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder="Digite o nome..."
              className="bg-light-navy text-white p-3 rounded-md border-2 border-slate/50 focus:border-accent focus:outline-none"
              required // Add required attribute for better accessibility
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled} // The button is now disabled if names are empty
          className={`mt-4 font-bold py-3 px-8 rounded-md text-lg transition-colors duration-300 ${
            isButtonDisabled
              ? 'bg-slate/20 text-slate/50 cursor-not-allowed'
              : 'bg-accent text-navy hover:bg-accent/80'
          }`}
        >
          Iniciar Preparação
        </button>
      </form>
    </div>
  );
}

export default NameEntryScreen;