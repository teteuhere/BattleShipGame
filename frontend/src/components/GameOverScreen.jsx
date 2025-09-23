import React from 'react';

// Este componente é o grande final! Ele celebra o vencedor,
// mostra as estatísticas da partida e oferece um botão para reiniciar a diversão.
// Encontra o vencedor e o perdedor para mostrar o placar final.
// Calcula as estatísticas de acertos e erros de cada jogador.
// A div que cria o fundo semitransparente.
// A janela do modal.
// Seção com o resumo da partida.
// O botão para jogar novamente.

function GameOverScreen({ gameState, onPlayAgain }) {
  const winner = gameState.players.find(p => p.id === gameState.winner);
  const loser = gameState.players.find(p => p.id !== gameState.winner);

  const calculateStats = (player) => {
    if (!player) return { hits: 0, misses: 0, total: 0, accuracy: '0' };
    const hits = player.hits || 0;
    const misses = player.misses || 0;
    const total = hits + misses;
    const accuracy = total > 0 ? ((hits / total) * 100).toFixed(1) : '0.0';
    return { hits, misses, total, accuracy };
  };

  const winnerStats = calculateStats(winner);
  const loserStats = calculateStats(loser);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center animate-fade-in z-50">
      
      {}
      <div className="bg-light-navy p-8 rounded-lg shadow-2xl border-2 border-accent/50 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-accent mb-2">JOGO ENCERRADO!</h1>
        <p className="text-xl text-white mb-6">{winner.name} venceu o combate!</p>

        {}
        <div className="space-y-4 text-left bg-navy/50 p-4 rounded-md">
          <div>
            <h3 className="font-bold text-white">{winner.name}, relátorio</h3>
            <p className="text-slate">
              <span className="text-green-400">{winnerStats.hits} acertos</span>, {' '}
              <span className="text-red-400">{winnerStats.misses} erros</span> — {winnerStats.accuracy}% precisão
            </p>
          </div>
          <div>
            <h3 className="font-bold text-white">{loser.name}'s relátorio</h3>
            <p className="text-slate">
              <span className="text-green-400">{loserStats.hits} acertos</span>, {' '}
              <span className="text-red-400">{loserStats.misses} erros</span> — {loserStats.accuracy}% precisão
            </p>
          </div>
        </div>

        {}
        <button
          onClick={onPlayAgain}
          className="mt-8 bg-accent text-navy font-bold py-3 px-8 rounded-md text-lg
                     hover:bg-accent/80 transition-colors duration-300 w-full"
        >
          Recomeçar
        </button>
      </div>
    </div>
  );
}

export default GameOverScreen;