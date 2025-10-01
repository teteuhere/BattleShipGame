import React from "react";

function LeaderboardModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl max-w-md w-full text-left relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-accent mb-6 text-center">
          🏆 Placar de Líderes 🏆
        </h2>

        {data && data.length > 0 ? (
          <ol className="space-y-3">
            {data.map((player, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-navy/50 p-3 rounded-md"
              >
                <span className="text-xl text-white font-bold">
                  {index + 1}. {player.name}
                </span>
                <span className="text-lg text-accent">
                  {player.wins} Vitórias
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-slate text-center">
            Nenhum comandante vitorioso ainda. Seja o primeiro!
          </p>
        )}
      </div>
    </div>
  );
}

export default LeaderboardModal;
