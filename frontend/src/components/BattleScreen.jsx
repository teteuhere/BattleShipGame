import React, { useMemo } from 'react';
import GameBoard from './GameBoard.jsx';

function BattleScreen({ gameState, onFireShot, gameMode, onSurrender}) {
  const { currentPlayer, opponentPlayer } = useMemo(() => {
    if (!gameState || !gameState.current_turn) {
      return { currentPlayer: null, opponentPlayer: null };
    }
    const current = gameState.players.find(p => p.id === gameState.current_turn);
    const opponent = gameState.players.find(p => p.id !== gameState.current_turn);
    return { currentPlayer: current, opponentPlayer: opponent };
  }, [gameState]);

  const shotsByPlayer = useMemo(() => {
      const shots = {};
      if (!gameState || !gameState.players) return shots;
      for (const player of gameState.players) {
          shots[player.id] = [];
      }
      gameState.shots?.forEach(shot => {
          if (shots[shot.player]) {
              shots[shot.player].push(shot);
          }
      });
      return shots;
  }, [gameState]);

  if (!currentPlayer || !opponentPlayer) {
    return <p className="text-accent animate-pulse">Loading Battle Data...</p>;
  }

  const buildGrid = (player, opponentShots, showShips = false) => {
    const grid = Array(10).fill(null).map(() =>
        Array(10).fill(null).map(() => ({ state: 'empty', hasShip: false }))
    );
    if (showShips) {
        player.ships?.forEach(ship => {
            ship.coordinates.forEach(([row, col]) => {
                if (grid[row] && grid[row][col]) grid[row][col].hasShip = true;
            });
        });
    }
    opponentShots?.forEach(shot => {
        const [row, col] = shot.coordinates;
        if (grid[row] && grid[row][col]) {
            grid[row][col].state = shot.is_hit ? 'hit' : 'miss';
        }
    });
    return grid;
  };

  const yourGrid = buildGrid(currentPlayer, shotsByPlayer[opponentPlayer.id] || [], true);
  const opponentGrid = buildGrid(opponentPlayer, shotsByPlayer[currentPlayer.id] || [], !!gameState.winner);

  const isHumanTurn = currentPlayer && !currentPlayer.is_ai;

  let statusMessage;
  if (gameState.winner) {
    statusMessage = `FIM DE JOGO!`;
  } else if (isHumanTurn) {
    statusMessage = "Aguardando ordens comandante! Clique em um ponto no radar para disparar.";
  } else {
    statusMessage = `${currentPlayer.name} is thinking...`;
  }

  const isPvaMode = gameMode === 'pva';

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="mb-8 p-4 bg-light-navy border-2 border-slate rounded-lg w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-accent">
          {gameState.winner ? 'AMEAÇA NEUTRALIZADA' : `Comandante: ${currentPlayer.name}`}
        </h2>
        <p className="text-slate mt-1">{statusMessage}</p>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
        {(isPvaMode || gameState.winner) && (
          <div>
            <h3 className="text-xl text-white mb-4">SUA FROTA ({currentPlayer.name})</h3>
            <GameBoard grid={yourGrid} />
          </div>
        )}

        <div>
          <h3 className="text-xl text-white mb-4">RADAR INIMIGO ({opponentPlayer.name})</h3>
          <GameBoard
            grid={opponentGrid}
            onCellClick={onFireShot}
            isInteractive={isHumanTurn && !gameState.winner}
          />
        </div>
      </div>

      {!gameState.winner && (
          <button
              onClick={() => onSurrender(currentPlayer.id)}
              className="mt-8 bg-slate/30 text-slate font-bold py-2 px-6 rounded-md border border-slate hover:bg-red-800 hover:text-white hover:border-red-700 transition-colors"
          >
              Enviar Rendição
          </button>
      )}
    </div>
  );
}

export default BattleScreen;
