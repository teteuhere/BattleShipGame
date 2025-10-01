import React from 'react';

function StartMenu({ onStartGame }) {
  return (
    <div className="flex flex-col items-center animate-fade-in gap-4">
      <div className="flex flex-row gap-4">
        <button
          onClick={() => onStartGame('pvp-classic')}
          className="w-72 bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md
                     hover:bg-accent hover:text-navy transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
        >
          JOGADOR VS. JOGADOR
        </button>
        <button
          onClick={() => onStartGame('pva')}
          className="w-72 bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md
                     hover:bg-accent hover:text-navy transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
        >
          JOGADOR VS. IA
        </button>
      </div>
      <button
        onClick={() => onStartGame('pvp-salvo')}
        className="w-[37rem] bg-navy text-amber-300 font-bold py-4 px-6 border-2 border-amber-400 rounded-md
                   hover:bg-amber-400 hover:text-navy transition-colors duration-300
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50"
      >
        JOGADOR VS. JOGADOR (SALVO)
      </button>
    </div>
  );
}

export default StartMenu;
