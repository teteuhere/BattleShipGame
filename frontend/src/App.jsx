// BattleShipGame/frontend/src/App.jsx

import React, { useState, useMemo } from 'react';
import StartMenu from './components/StartMenu.jsx';
import NameEntryScreen from './components/NameEntryScreen.jsx';
import SetupScreen from './components/SetupScreen.jsx';
import BattleScreen from './components/BattleScreen.jsx';
import TurnSwitchScreen from './components/TurnSwitchScreen.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import { createGame, placeShips, fireShot } from '../api.js';

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gamePhase, setGamePhase] = useState('menu');
  const [gameMode, setGameMode] = useState('pvp');
  const [placingPlayerId, setPlacingPlayerId] = useState(null);
  const [showTurnSwitch, setShowTurnSwitch] = useState(false);

  const placingPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id === placingPlayerId);
  }, [gameState, placingPlayerId]);

  const nextPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id !== placingPlayerId);
  }, [gameState, placingPlayerId]);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGamePhase('nameEntry'); // Agora vamos para a tela de nomes
  };

  const handleNamesSubmitted = async (playerNames) => {
    setIsLoading(true);
    setError(null);
    try {
      const newGame = await createGame(gameMode, playerNames);
      setGameState(newGame);
      const firstPlayer = newGame.players.find(p => !p.is_ai);
      if (firstPlayer) {
        setPlacingPlayerId(firstPlayer.id);
      }
      setGamePhase('placing');
    } catch (err) {
      setError('Falha ao iniciar um novo jogo. Verifique se o servidor backend está rodando!');
    } finally {
      setIsLoading(false);
    }
  };

   const handlePlacementComplete = async (ships) => {
    if (!placingPlayer) return;
    setIsLoading(true);
    setError(null);
    try {
      await placeShips(gameState.id, placingPlayer.id, ships);
      
      if (gameMode === 'pvp') {
        // Encontra o primeiro jogador criado no jogo
        const firstPlayer = gameState.players.find(p => !p.is_ai);
        
        // Compara o ID do jogador atual com o do primeiro jogador
        const isFirstPlayerTurn = placingPlayer.id === firstPlayer.id;

        if (isFirstPlayerTurn) {
          setShowTurnSwitch(true);
        } else {
          const response = await fetch(`http://localhost:8000/api/games/${gameState.id}/`);
          const updatedGame = await response.json();
          setGameState(updatedGame);
          setGamePhase('battle');
        }
      } else { // Para o modo PvA
        const response = await fetch(`http://localhost:8000/api/games/${gameState.id}/`);
        const updatedGame = await response.json();
        setGameState(updatedGame);
        setGamePhase('battle');
      }
    } catch (err) {
      setError("Erro: Falha ao confirmar o posicionamento dos navios.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnSwitchReady = () => {
    setPlacingPlayerId(nextPlayer.id);
    setShowTurnSwitch(false);
  };

  const handleFireShot = async (row, col) => {
    if (!gameState || !gameState.current_turn || gameState.winner) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedGameState = await fireShot(gameState.id, gameState.current_turn, [row, col]);
      setGameState(updatedGameState);
    } catch (err) {
      setError("Erro ao disparar. O inimigo pode ter bloqueado nossos sistemas!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setGameState(null);
    setGamePhase('menu');
    setPlacingPlayerId(null);
    setShowTurnSwitch(false);
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-accent animate-pulse">Carregando Missão...</p>;
    }
    if (error) {
      return <p className="text-red-500 font-bold">{error}</p>;
    }
    if (showTurnSwitch) {
      return <TurnSwitchScreen nextPlayerName={nextPlayer?.name} onReady={handleTurnSwitchReady} />;
    }

    switch (gamePhase) {
      case 'nameEntry':
        return <NameEntryScreen gameMode={gameMode} onNamesSubmitted={handleNamesSubmitted} />;
      case 'placing':
        if (!placingPlayer) {
          return <p className="text-accent animate-pulse">Carregando Dados do Jogador...</p>;
        }
        return <SetupScreen key={placingPlayer.id} player={placingPlayer} onPlacementComplete={handlePlacementComplete} />;
      case 'battle':
        if (!gameState) {
          return <p className="text-accent animate-pulse">Preparando para a Batalha...</p>;
        }
        return <BattleScreen gameState={gameState} onFireShot={handleFireShot} gameMode={gameMode} />;
      case 'menu':
      default:
        return <StartMenu onStartGame={handleStartGame} />;
    }
  }

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest">BATALHA-NAVAL</h1>
          <p className="text-accent mt-2">O CLÁSSICO JOGO BATALHA NAVAL</p>
        </div>
        
        {renderContent()}

        {gameState && gameState.winner && (
          <GameOverScreen gameState={gameState} onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </main>
  );
}

export default App;