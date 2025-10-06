import React, { useState, useMemo, useEffect } from 'react';
import GameBoard from './GameBoard.jsx';

function BattleScreen({ gameState, onFireShot, onSurrender, currentPlayer, playerMode, localPlayerId, onShowAbilities, targetingMode, onRowOrColClick, scoutedCells, torpedoPath }) {
  const [salvoTargets, setSalvoTargets] = useState([]);

  const { opponentPlayer } = useMemo(() => {
    if (!gameState || !currentPlayer) return { opponentPlayer: null };
    return { opponentPlayer: gameState.players.find(p => p.id !== currentPlayer.id) };
  }, [gameState, currentPlayer]);

  useEffect(() => {
    setSalvoTargets([]);
  }, [currentPlayer]);

  if (!currentPlayer || !opponentPlayer) {
    return <p className="text-accent animate-pulse">Carregando dados de batalha...</p>;
  }

  let isMyTurn;
  if (playerMode === 'online') {
    isMyTurn = currentPlayer.id === localPlayerId;
  } else {
    isMyTurn = !currentPlayer.is_ai;
  }

  const isSalvoMode = gameState.game_mode === 'salvo';
  const shipsLeft = useMemo(() => {
    if (!currentPlayer.ships) return 0;
    return currentPlayer.ships.filter(ship => !ship.is_sunk).length;
  }, [currentPlayer]);
  const shotsAllowed = isSalvoMode ? shipsLeft : 1;

  const handleCellClick = (row, col) => {
    if (isSalvoMode) {
      const targetKey = `${row}-${col}`;
      const isAlreadySelected = salvoTargets.some(t => `${t[0]}-${t[1]}` === targetKey);
      if (isAlreadySelected) {
        setSalvoTargets(salvoTargets.filter(t => `${t[0]}-${t[1]}` !== targetKey));
      } else {
        if (salvoTargets.length < shotsAllowed) {
          setSalvoTargets([...salvoTargets, [row, col]]);
        }
      }
    } else {
      onFireShot([[row, col]]);
    }
  };

  const handleFireSalvo = () => {
    onFireShot(salvoTargets);
    setSalvoTargets([]);
  };

  const buildGrid = (player, opponentShots, showShips = false) => {
    const grid = Array(gameState.board_height).fill(null).map(() => Array(gameState.board_width).fill(null).map(() => ({ state: 'empty', hasShip: false })));
    if (showShips && player.ships) {
      player.ships.forEach(ship => {
        ship.coordinates.forEach(([row, col]) => {
          if (grid[row] && grid[row][col]) grid[row][col].hasShip = true;
        });
      });
    }
    if(opponentShots) {
        opponentShots.forEach(shot => {
        const [row, col] = shot.coordinates;
        if (grid[row] && grid[row][col]) {
            grid[row][col].state = shot.is_hit ? 'hit' : 'miss';
        }
        });
    }
    return grid;
  };

  const shotsByPlayer = useMemo(() => {
    const shots = {};
    gameState.players.forEach(p => shots[p.id] = []);
    gameState.shots?.forEach(shot => {
      if (shots[shot.player]) {
        shots[shot.player].push(shot);
      }
    });
    return shots;
  }, [gameState]);

  const opponentGrid = buildGrid(opponentPlayer, shotsByPlayer[currentPlayer.id] || [], !!gameState.winner);
  const isEmpd = gameState.emp_active_on_player === currentPlayer?.id;

  let statusMessage;
  if (gameState.winner) {
    statusMessage = `FIM DE JOGO!`;
  } else if (isEmpd) {
    statusMessage = "Sistemas desativados por EMP! Você perdeu o turno.";
  } else if (isMyTurn) {
    if (isSalvoMode) {
      const targetsLeft = shotsAllowed - salvoTargets.length;
      statusMessage = `MODO SALVO: Você tem ${shotsAllowed} disparos. Selecione mais ${targetsLeft} alvos.`;
      if (targetsLeft === 0) {
        statusMessage = `MODO SALVO: ${shotsAllowed} alvos selecionados. Pronto para disparar!`;
      }
    } else if (targetingMode === 'torpedo_row') {
      statusMessage = "Alvo do Torpedo: Selecione uma LINHA para atacar.";
    } else if (targetingMode === 'torpedo_col') {
      statusMessage = "Alvo do Torpedo: Selecione uma COLUNA para atacar.";
    } else {
      statusMessage = "Aguardando ordens! Clique no radar para disparar ou use uma habilidade.";
    }
  } else {
    statusMessage = `${currentPlayer.name} está pensando...`;
  }

  return (
    <div className="w-full flex flex-col items-center animate-fade-in">
      <div className="mb-8 p-4 bg-light-navy border-2 border-slate rounded-lg w-full max-w-4xl text-center">
        <h2 className="text-2xl font-bold text-accent">
          {gameState.winner ? 'AMEAÇA NEUTRALIZADA' : `Comandante: ${currentPlayer.name}`}
        </h2>
        <p className="text-slate mt-1">{statusMessage}</p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
        <div>
          <h3 className="text-xl text-white mb-4">RADAR INIMIGO ({opponentPlayer.name})</h3>
          <GameBoard
            gameState={gameState}
            grid={opponentGrid}
            onCellClick={handleCellClick}
            isInteractive={isMyTurn && !gameState.winner && !targetingMode && !isEmpd}
            scoutedCells={scoutedCells}
            torpedoPath={torpedoPath}
            targetingMode={targetingMode}
            onRowOrColClick={onRowOrColClick}
            salvoTargets={salvoTargets}
          />
        </div>
      </div>
      <div className="mt-8 flex gap-4 items-center">
        {isSalvoMode && isMyTurn && !gameState.winner && salvoTargets.length === shotsAllowed && (
          <button
            onClick={handleFireSalvo}
            className="font-bold py-2 px-6 rounded-md border transition-colors bg-red-500/30 text-red-300 border-red-400 hover:bg-red-500 hover:text-white"
          >
            Disparar Salvo! ({shotsAllowed})
          </button>
        )}
        {gameState.power_ups_enabled && isMyTurn && !gameState.winner && !isEmpd && (
          <button
            onClick={onShowAbilities}
            className="font-bold py-2 px-6 rounded-md border transition-colors bg-amber-500/30 text-amber-300 border-amber-400 hover:bg-amber-500 hover:text-white"
            title="Abrir seu arsenal de habilidades"
          >
            💥 Arsenal
          </button>
        )}
        {!gameState.winner && (
          <button
            onClick={() => onSurrender(currentPlayer.id)}
            className="bg-slate/30 text-slate font-bold py-2 px-6 rounded-md border border-slate hover:bg-red-800 hover:text-white hover:border-red-700 transition-colors"
          >
            Enviar Rendição
          </button>
        )}
      </div>
    </div>
  );
}

export default BattleScreen;
