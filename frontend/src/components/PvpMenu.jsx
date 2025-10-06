import React from "react";

function PvpMenu({ onSelectMode, onBack }) {
  return (
    <div className="flex flex-col items-center animate-fade-in gap-4">
      <h2 className="text-3xl text-accent mb-4">Escolha o Modo PvP</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => onSelectMode("pvp-classic")}
          className="w-72 bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md
                     hover:bg-accent hover:text-navy transition-colors duration-300"
        >
          CLÁSSICO
        </button>
        <button
          onClick={() => onSelectMode("pvp-salvo")}
          className="w-72 bg-navy text-amber-300 font-bold py-4 px-6 border-2 border-amber-400 rounded-md
                     hover:bg-amber-400 hover:text-navy transition-colors duration-300"
        >
          RÁPIDO
        </button>
      </div>
    </div>
  );
}

export default PvpMenu;
