import React from 'react';

// Tela para gerenciar a troca de turnos entre os jogadores durante a configuração.

function TurnSwitchScreen({ nextPlayerName, onReady }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center animate-fade-in">
      <div>
        <h2 className="text-3xl text-accent mb-4">
          Próximo: {nextPlayerName}
        </h2>
        <p className="text-xl text-slate">
          Passe o dispositivo para o <span className="font-bold text-white">{nextPlayerName}</span>.
        </p>
        <p className="text-slate">Clique no botão quando você estiver pronto para alocar suas embarcações!</p>
      </div>

      <button
        onClick={onReady}
        className="bg-accent text-navy font-bold py-3 px-8 rounded-md text-lg
                   hover:bg-accent/80 transition-colors duration-300"
      >
        Pronto para disparar os návios
      </button>
    </div>
  );
}

export default TurnSwitchScreen;