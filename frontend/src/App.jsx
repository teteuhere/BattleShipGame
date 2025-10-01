import React, { useState, useMemo } from 'react';
import StartMenu from './components/StartMenu.jsx';
import NameEntryScreen from './components/NameEntryScreen.jsx';
import SetupScreen from './components/SetupScreen.jsx';
import BattleScreen from './components/BattleScreen.jsx';
import TurnSwitchScreen from './components/TurnSwitchScreen.jsx';
import GameOverScreen from './components/GameOverScreen.jsx';
import {
  createGame,
  placeShips,
  fireShot,
  surrenderGame,
  getLeaderboard,
  useAbility,
} from '../api.js';
import HelpModal from './components/HelpModal.jsx';
import AIChat from './components/AIChat.jsx';
import AlertModal from './components/AlertModal.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';
import LeaderboardModal from './components/LeaderboardModal.jsx';
import AbilitiesModal from './components/AbilitiesModal.jsx';

/**
 * This is the main application component, acting as the "mission control" for the entire game.
 * It manages all game states and phases, from the main menu to the final victory screen.
 * The `handleFireShot` function has been updated to generate a summary message for Salvo attacks,
 * providing clearer feedback to the player instead of a list of repetitive messages.
 */
function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gamePhase, setGamePhase] = useState('menu');

  const [playerMode, setPlayerMode] = useState('pvp');
  const [gameRules, setGameRules] = useState('classic');

  const [placingPlayerId, setPlacingPlayerId] = useState(null);
  const [showTurnSwitch, setShowTurnSwitch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [showAbilitiesModal, setShowAbilitiesModal] = useState(false);
  const [targetingMode, setTargetingMode] = useState(null);
  const [scoutedCells, setScoutedCells] = useState([]);
  const [torpedoPath, setTorpedoPath] = useState(null);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
  };

  const placingPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id === placingPlayerId);
  }, [gameState, placingPlayerId]);

  const nextPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find(p => p.id !== placingPlayerId);
  }, [gameState, placingPlayerId]);

  const handleStartGame = (mode) => {
    if (mode === 'pvp-classic') {
      setPlayerMode('pvp');
      setGameRules('classic');
    } else if (mode === 'pvp-salvo') {
      setPlayerMode('pvp');
      setGameRules('salvo');
    } else {
      setPlayerMode('pva');
      setGameRules('classic');
    }
    setGamePhase('nameEntry');
  };

  const handleNamesSubmitted = async (gameOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const newGame = await createGame(playerMode, gameRules, gameOptions);
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
      if (playerMode === 'pvp') {
        const isFirstPlayerTurn = placingPlayer.id === gameState.players.find(p => !p.is_ai).id;
        if (isFirstPlayerTurn) {
          setShowTurnSwitch(true);
        } else {
          const response = await fetch(`http://localhost:8000/api/games/${gameState.id}/`);
          const updatedGame = await response.json();
          setGameState(updatedGame);
          setGamePhase('battle');
        }
      } else {
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

  const handleFireShot = async (coordinatesList) => {
    if (scoutedCells.length > 0) setScoutedCells([]);
    if (torpedoPath) setTorpedoPath(null);

    if (!gameState || !gameState.current_turn || gameState.winner) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fireShot(gameState.id, gameState.current_turn, coordinatesList);
      setGameState(response.game_state);

      if (response.shot_results && response.shot_results.length > 0) {
        // --- NEW SALVO SUMMARY LOGIC ---
        let summaryMessage = '';
        const totalShots = response.shot_results.length;
        const winResult = response.shot_results.find(r => r.result === 'win');

        if (winResult) {
          summaryMessage = winResult.message;
        } else {
          const hitCount = response.shot_results.filter(r => r.result === 'hit').length;

          if (totalShots > 1) { // Salvo mode summary
            if (hitCount === 0) {
              summaryMessage = `Você errou todos os ${totalShots} disparos.`;
            } else if (hitCount === totalShots) {
              summaryMessage = `Incrível! Você acertou todos os ${totalShots} disparos!`;
            } else {
              summaryMessage = `Você acertou ${hitCount} de ${totalShots} disparos.`;
            }
          } else { // Classic mode - just show the single message
            summaryMessage = response.shot_results[0]?.message || '';
          }

          const sunkMessages = response.shot_results
            .map(r => r.message)
            .filter(msg => msg && (msg.includes('afundou') || msg.includes('Reação em cadeia')));

          if (sunkMessages.length > 0) {
            summaryMessage += `\n\n${sunkMessages.join('\n')}`;
          }
        }

        if (summaryMessage) {
          setAlertMessage(summaryMessage);
        }
        // --- END OF NEW LOGIC ---
      }
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
    setScoutedCells([]);
    setTorpedoPath(null);
    setTargetingMode(null);
  };

  const handleGoToMenu = () => {
    setConfirmModal({
      isOpen: true,
      message: 'Tem certeza que deseja voltar ao menu principal? O progresso do jogo atual será perdido.',
      onConfirm: () => {
        handlePlayAgain();
        setConfirmModal({ isOpen: false });
      },
      onClose: () => setConfirmModal({ isOpen: false }),
    });
  };

  const handleSurrender = (playerId) => {
    setConfirmModal({
      isOpen: true,
      message: 'Tem certeza de que deseja se render?',
      onConfirm: async () => {
        setConfirmModal({ isOpen: false });
        setIsLoading(true);
        setError(null);
        try {
          const updatedGameState = await surrenderGame(gameState.id, playerId);
          setGameState(updatedGameState);
        } catch (err) {
          setError("Erro ao se render. O oponente pode ter bloqueado nossos sistemas!");
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => setConfirmModal({ isOpen: false }),
    });
  };

  const handleShowLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
      setShowLeaderboard(true);
    } catch (err) {
      handleShowAlert("Não foi possível carregar o placar de líderes. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseAbility = async (abilityType, options = {}) => {
    if (!gameState) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await useAbility(gameState.id, gameState.current_turn, abilityType, options);
      setGameState(response.game_state);

      const result = response.ability_result;
      if (result.scouted_cells) {
        setScoutedCells(result.scouted_cells);
        handleShowAlert("Avião espião revelou uma área do inimigo!");
      }
      if (result.message) {
        handleShowAlert(result.message);
      }
      if (result.torpedo_path) {
        setTorpedoPath(result.torpedo_path);
      }
      if(result.shot_result?.message){
        setTimeout(() => handleShowAlert(result.shot_result.message), 500);
      }
    } catch (err) {
      handleShowAlert(err.message);
    } finally {
      setIsLoading(false);
      setShowAbilitiesModal(false);
      setTargetingMode(null);
    }
  };

  const handleTorpedoClick = () => {
    setShowAbilitiesModal(false);
    setConfirmModal({
      isOpen: true,
      message: 'Lançar torpedo em uma Linha ou Coluna?',
      confirmText: 'Linha (A-J)',
      onConfirm: () => {
        setTargetingMode('torpedo_row');
        setConfirmModal({ isOpen: false });
      },
      cancelText: 'Coluna (1-10)',
      onClose: () => {
        setTargetingMode('torpedo_col');
        setConfirmModal({ isOpen: false });
      }
    });
  };

  const handleTorpedoTarget = (type, index) => {
    handleUseAbility('torpedo', { target_type: type, index: index });
  };

  const renderContent = () => {
    if (isLoading && !showLeaderboard) {
      return <p className="text-accent animate-pulse">Carregando Missão...</p>;
    }
    if (error) {
      return <p className="text-red-500 font-bold">{error}</p>;
    }
    if (showTurnSwitch) {
      return <TurnSwitchScreen nextPlayerName={nextPlayer?.name} onReady={handleTurnSwitchReady} />;
    }

    switch (gamePhase) {
      case 'battle':
        if (!gameState) {
          return <p className="text-accent animate-pulse">Preparando para a Batalha...</p>;
        }
        return <BattleScreen
                  gameState={gameState}
                  onFireShot={handleFireShot}
                  onSurrender={handleSurrender}
                  currentPlayer={gameState.players.find(p => p.id === gameState.current_turn)}
                  scoutedCells={scoutedCells}
                  torpedoPath={torpedoPath}
                  targetingMode={targetingMode}
                  onShowAbilities={() => setShowAbilitiesModal(true)}
                  onRowOrColClick={handleTorpedoTarget}
                />;
      case 'nameEntry':
        return <NameEntryScreen playerMode={playerMode} onNamesSubmitted={handleNamesSubmitted} />;
      case 'placing':
        if (!placingPlayer) {
          return <p className="text-accent animate-pulse">Carregando Dados do Jogador...</p>;
        }
        return <SetupScreen key={placingPlayer.id} player={placingPlayer} onPlacementComplete={handlePlacementComplete} onShowAlert={handleShowAlert} />;
      case 'menu':
      default:
        return <StartMenu onStartGame={handleStartGame} />;
    }
  };

  const { currentPlayerForModal } = useMemo(() => {
    if (!gameState || !gameState.current_turn) return { currentPlayerForModal: null };
    return { currentPlayerForModal: gameState.players.find(p => p.id === gameState.current_turn) };
  }, [gameState]);

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-8">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showLeaderboard && <LeaderboardModal data={leaderboardData} onClose={() => setShowLeaderboard(false)} />}
      {showAbilitiesModal && (
        <AbilitiesModal
          player={currentPlayerForModal}
          onClose={() => setShowAbilitiesModal(false)}
          onUseScout={() => handleUseAbility('scout')}
          onUseTorpedo={handleTorpedoClick}
          onUseEMP={() => handleUseAbility('emp')}
        />
      )}
      <div className="max-w-7xl mx-auto text-center">
        <div className="absolute top-4 left-4 z-50">
           {gamePhase !== 'menu' && (
              <button onClick={handleGoToMenu} className="text-accent text-3xl font-bold hover:text-white transition-colors" title="Voltar ao Menu">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                  </svg>
              </button>
           )}
        </div>

        <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
          <button onClick={handleShowLeaderboard} className="text-accent text-3xl font-bold hover:text-white transition-colors" title="Placar de Líderes">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.41 8.553a.5.5 0 0 1 .18 0l6 3a.5.5 0 0 1 0 .894l-6 3a.5.5 0 0 1-.58 0l-6-3a.5.5 0 0 1 0-.894l6-3zM8 11.053l4.242-2.122L8 6.808 3.758 8.931 8 11.053z"/>
                <path d="M7.41 4.553a.5.5 0 0 1 .18 0l6 3a.5.5 0 0 1 0 .894l-6 3a.5.5 0 0 1-.58 0l-6-3a.5.5 0 0 1 0-.894l6-3zM8 7.053L12.242 4.93 8 2.808 3.758 4.93 8 7.053z"/>
              </svg>
          </button>
          <button onClick={() => setShowHelp(true)} className="text-accent text-3xl font-bold hover:text-white transition-colors">
            ?
          </button>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest">BATALHA-NAVAL</h1>
          <p className="text-accent mt-2">O CLÁSSICO JOGO BATALHA NAVAL</p>
        </div>
        <AIChat />
        {renderContent()}
        {alertMessage && <AlertModal message={alertMessage} onClose={() => setAlertMessage('')} />}
        {confirmModal.isOpen && (
            <ConfirmModal
                {...confirmModal}
            />
        )}
        {gameState && gameState.winner && (
          <GameOverScreen gameState={gameState} onPlayAgain={handlePlayAgain} />
        )}
      </div>
    </main>
  );
}

export default App;
