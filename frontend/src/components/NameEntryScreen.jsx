// BattleShipGame (Cópia)/frontend/src/components/NameEntryScreen.jsx

import React, { useState } from 'react';

function NameEntryScreen({ playerMode, onNamesSubmitted }) { // Prop updated to playerMode
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [powerUps, setPowerUps] = useState(false);

  // Logic now correctly uses playerMode
  const isPvp = playerMode === 'pvp';
  const isButtonDisabled = isPvp ? !player1Name || !player2Name : !player1Name;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    onNamesSubmitted({
      player1: player1Name,
      player2: isPvp ? player2Name : null,
      power_ups_enabled: isPvp ? powerUps : true,
    });
  };

  return (
    <div className="flex flex-col items-center animate-fade-in text-center">
      <h2 className="text-3xl text-accent mb-6">Comandante, identifique-se!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
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
            required
          />
        </div>

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
              required
            />
          </div>
        )}

        {isPvp && (
          <div className="flex items-center justify-center gap-3 text-slate">
            <input
              type="checkbox"
              id="powerups"
              checked={powerUps}
              onChange={(e) => setPowerUps(e.target.checked)}
              className="h-5 w-5 rounded bg-light-navy border-slate/50 text-accent focus:ring-accent"
            />
            <label htmlFor="powerups">Ativar Arsenal</label>
          </div>
        )}

        <button
          type="submit"
          disabled={isButtonDisabled}
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
