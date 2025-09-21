// BattleShipGame/frontend/src/components/BattleScreen.jsx

import React, { useMemo } from 'react';
import GameBoard from './GameBoard.jsx';

// We now accept 'gameMode' as a prop
function BattleScreen({ gameState, onFireShot, gameMode }) {
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

  // The logic for building grids remains the same.
  const yourGrid = buildGrid(currentPlayer, shotsByPlayer[opponentPlayer.id] || [], true);
  // We only show opponent ships if there's a winner.
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
  
  // This determines if we are in Player vs AI mode.
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
        {/* NEW DISPLAY LOGIC!
          Show the player's grid if:
          1. It's Player vs. AI mode.
          2. The game is over (so both players can see the final result).
        */}
        {(isPvaMode || gameState.winner) && (
          <div>
            <h3 className="text-xl text-white mb-4">SUA FROTA ({currentPlayer.name})</h3>
            <GameBoard grid={yourGrid} />
          </div>
        )}

        {/* Always show the opponent's grid */}
        <div>
          <h3 className="text-xl text-white mb-4">RADAR INIMIGO ({opponentPlayer.name})</h3>
          <GameBoard 
            grid={opponentGrid}
            onCellClick={onFireShot}
            isInteractive={isHumanTurn && !gameState.winner}
          />
        </div>
      </div>
    </div>
  );
}

export default BattleScreen;