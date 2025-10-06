import React from "react";

function StartMenu({ onStartGame }) {
  return (
    <div className="flex flex-col items-center animate-fade-in gap-4 w-full md:w-[37rem]">
      {/* <button
        onClick={() => onStartGame("pvp")}
        className="w-full bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md
                   hover:bg-accent hover:text-navy transition-colors duration-300"
      >
        JOGADOR VS. JOGADOR
      </button>
      <button
        onClick={() => onStartGame("pva")}
        className="w-full bg-light-navy text-accent font-bold py-4 px-6 border-2 border-accent rounded-md
                   hover:bg-accent hover:text-navy transition-colors duration-300"
      >
        JOGADOR VS. IA
      </button> */}
      <button
        onClick={() => onStartGame("online")}
        className="w-full bg-navy text-cyan-300 font-bold py-4 px-6 border-2 border-cyan-400 rounded-md
                   hover:bg-cyan-400 hover:text-navy transition-colors duration-300"
      >
        ONLINE
      </button>
    </div>
  );
}

export default StartMenu;
