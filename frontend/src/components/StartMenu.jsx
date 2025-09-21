import React from 'react';

function StartMenu({ onStartGame }) {
  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="flex flex-row gap-4">
        {/* PvP Button */}
        <button
          onClick={() => onStartGame('pvp')}
          className="w-72 bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md 
                     hover:bg-accent hover:text-navy transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
        >
          JOGADOR VS. JOGADOR
        </button>
        {/* PvA Button - Now enabled! */}
        <button
          onClick={() => onStartGame('pva')}
          className="w-72 bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md 
                     hover:bg-accent hover:text-navy transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50"
        >
          JOGADOR VS. IA
        </button>
      </div>
    </div>
  );
}

export default StartMenu;