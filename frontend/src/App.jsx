import React, { useState, useMemo, useEffect, useRef } from "react";
import StartMenu from "./components/StartMenu.jsx";
import NameEntryScreen from "./components/NameEntryScreen.jsx";
import SetupScreen from "./components/SetupScreen.jsx";
import BattleScreen from "./components/BattleScreen.jsx";
import TurnSwitchScreen from "./components/TurnSwitchScreen.jsx";
import GameOverScreen from "./components/GameOverScreen.jsx";
import {
  createGame,
  placeShips,
  fireShot,
  surrenderGame,
  getLeaderboard,
  useAbility,
  joinGame,
  createOnlineGame,
  getGameState,
} from "../api.js";
import HelpModal from "./components/HelpModal.jsx";
import AIChat from "./components/AIChat.jsx";
import AlertModal from "./components/AlertModal.jsx";
import OnlineMenu from "./components/OnlineMenu.jsx";
import PvpMenu from "./components/PvpMenu.jsx";
import LeaderboardModal from "./components/LeaderboardModal.jsx";
import AbilitiesModal from "./components/AbilitiesModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gamePhase, setGamePhase] = useState("menu");
  const [playerMode, setPlayerMode] = useState("pvp");
  const [gameRules, setGameRules] = useState("classic");
  const [placingPlayerId, setPlacingPlayerId] = useState(null);
  const [showTurnSwitch, setShowTurnSwitch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [localPlayerId, setLocalPlayerId] = useState(null);
  const pollingRef = useRef(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showAbilities, setShowAbilities] = useState(false);
  const [targetingMode, setTargetingMode] = useState(null);
  const [showTorpedoConfirm, setShowTorpedoConfirm] = useState(false);

  const gameStateRef = useRef(gameState);
  const localPlayerIdRef = useRef(localPlayerId);
  useEffect(() => {
    gameStateRef.current = gameState;
    localPlayerIdRef.current = localPlayerId;
  }, [gameState, localPlayerId]);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const startPolling = (gameId) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const updatedGame = await getGameState(gameId);
        setGameState(updatedGame);
      } catch (err) {
        console.error("Polling error:", err);
        setError("Perdeu a conexão com o servidor.");
        stopPolling();
      }
    }, 3500);
  };

  useEffect(() => {
    if (gameState?.status === "finished") {
      stopPolling();
    }
  }, [gameState]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const activeGame = gameStateRef.current;
      const currentPlayerId = localPlayerIdRef.current;
      if (
        activeGame &&
        activeGame.status !== "finished" &&
        playerMode === "online" &&
        currentPlayerId
      ) {
        const payload = { player_id: currentPlayerId };
        fetch(`http://52.15.115.204:8000/api/games/${activeGame.id}/surrender/`, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
          keepalive: true,
        });
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [playerMode]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const handleShowAlert = (message) => setAlertMessage(message);

  const handleShowLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
      setShowLeaderboard(true);
    } catch (err) {
      handleShowAlert("Não foi possível carregar o placar.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartGame = (mode) => {
    setGameState(null);
    if (mode === "pvp") {
      setGamePhase("pvpMenu");
    } else if (mode === "pva") {
      setPlayerMode("pva");
      setGameRules("classic");
      setGamePhase("nameEntry");
    } else if (mode === "online") {
      setPlayerMode("online");
    } else if (mode === "pvp-classic") {
      setPlayerMode("pvp");
      setGameRules("classic");
      setGamePhase("nameEntry");
    } else if (mode === "pvp-salvo") {
      setPlayerMode("pvp");
      setGameRules("salvo");
      setGamePhase("nameEntry");
    }
  };

  const handleHost = async (playerName) => {
    setIsLoading(true);
    try {
      const isMobile = window.innerWidth < 768;
      const boardConfig = isMobile
        ? { boardWidth: 10, boardHeight: 10 }
        : { boardWidth: 32, boardHeight: 8 };

      const newGame = await createOnlineGame(playerName, boardConfig);
      setGameState(newGame);
      setLocalPlayerId(newGame.players[0].id);
      startPolling(newGame.id);
    } catch (err) {
      handleShowAlert("Não foi possível criar o jogo. O servidor está online?");
    }
    setIsLoading(false);
  };

  const handleJoin = async (gameCode, playerName) => {
    setIsLoading(true);
    try {
      const newGame = await joinGame(gameCode, playerName);
      setGameState(newGame);
      setLocalPlayerId(newGame.players.find((p) => p.name === playerName).id);
      startPolling(newGame.id);
    } catch (err) {
      handleShowAlert(err.message);
    }
    setIsLoading(false);
  };

  const handleNamesSubmitted = async (gameOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const isMobile = window.innerWidth < 768;
      const boardConfig = isMobile
        ? { boardWidth: 10, boardHeight: 10 }
        : { boardWidth: 32, boardHeight: 8 };

      const newGame = await createGame(playerMode, gameRules, {
        ...gameOptions,
        ...boardConfig,
      });
      setGameState(newGame);
      setPlacingPlayerId(newGame.players[0].id);
      setGamePhase("placing");
    } catch (err) {
      setError("Falha ao iniciar um novo jogo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlacementComplete = async (ships) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedGame = await placeShips(
        gameState.id,
        placingPlayerId,
        ships
      );
      setGameState(updatedGame);
      const allPlayersPlaced = updatedGame.status === "battle";
      if (allPlayersPlaced) {
        setGamePhase("battle");
      } else if (playerMode === "pvp") {
        setShowTurnSwitch(true);
      }
    } catch (err) {
      setError("Erro: Falha ao confirmar o posicionamento dos navios.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlinePlacementComplete = async (ships) => {
    stopPolling();
    setIsLoading(true);
    setError(null);
    let updatedGame = null;
    try {
      updatedGame = await placeShips(gameState.id, localPlayerId, ships);
      setGameState(updatedGame);
    } catch (err) {
      handleShowAlert("Falha ao confirmar o posicionamento dos navios.");
    } finally {
      setIsLoading(false);
      if (playerMode === "online" && updatedGame) {
        startPolling(gameState.id);
      }
    }
  };

  const handleTurnSwitchReady = () => {
    const nextPlayer = gameState.players.find((p) => p.id !== placingPlayerId);
    if (nextPlayer) {
      setPlacingPlayerId(nextPlayer.id);
    }
    setShowTurnSwitch(false);
  };

  const handleFireShot = async (coordinatesList) => {
    if (!gameState || !gameState.current_turn || gameState.winner) return;
    if (playerMode === "online") stopPolling();
    setIsLoading(true);
    setError(null);
    let response = null;
    try {
      response = await fireShot(
        gameState.id,
        gameState.current_turn,
        coordinatesList
      );
      setGameState(response.game_state);
    } catch (err) {
      setError("Erro ao disparar.");
    } finally {
      setIsLoading(false);
      if (
        playerMode === "online" &&
        response?.game_state?.status !== "finished"
      ) {
        startPolling(gameState.id);
      }
    }
  };

  const handleSurrender = async (playerId) => {
    if (!gameState) return;
    try {
      const updatedGame = await surrenderGame(gameState.id, playerId);
      setGameState(updatedGame);
    } catch (err) {
      setError("Erro ao se render.");
    }
  };

  const handlePlayAgain = () => {
    setGameState(null);
    setGamePhase("menu");
    setPlayerMode("pvp");
    setPlacingPlayerId(null);
    setShowTurnSwitch(false);
    setError(null);
    setLocalPlayerId(null);
    stopPolling();
  };

  const handleGoToMenu = () => {
    handlePlayAgain();
  };

  const handleUseAbility = async (abilityType, options = {}) => {
    if (!gameState) return;
    if (playerMode === "online") stopPolling();
    setIsLoading(true);
    let response = null;
    try {
      response = await useAbility(
        gameState.id,
        gameState.current_turn,
        abilityType,
        options
      );
      setGameState(response.game_state);
      if (response.ability_result?.message) {
        handleShowAlert(response.ability_result.message);
      }
    } catch (err) {
      handleShowAlert(err.message || `Falha ao usar ${abilityType}.`);
    } finally {
      setShowAbilities(false);
      setTargetingMode(null);
      setIsLoading(false);
      if (
        playerMode === "online" &&
        response?.game_state?.status !== "finished"
      ) {
        startPolling(gameState.id);
      }
    }
  };

  const handleSelectTorpedoTarget = (type, index) => {
    handleUseAbility("torpedo", { target_type: type, index: index });
    setTargetingMode(null);
  };

  const renderContent = () => {
    if (isLoading)
      return <p className="text-accent animate-pulse">Carregando Missão...</p>;
    if (error) return <p className="text-red-500 font-bold">{error}</p>;

    if (playerMode === "online") {
      if (!gameState) {
        return (
          <OnlineMenu
            onHost={handleHost}
            onJoin={handleJoin}
            onError={handleShowAlert}
          />
        );
      }
      const localPlayer = gameState.players.find((p) => p.id === localPlayerId);

      switch (gameState.status) {
        case "waiting_for_player":
          return (
            <div className="bg-navy/50 p-6 rounded-lg">
              {" "}
              <h2 className="text-2xl text-accent mb-4">
                Aguardando oponente...
              </h2>{" "}
              <p className="text-white text-lg">Compartilhe este código:</p>{" "}
              <p className="text-2xl font-mono tracking-widest bg-navy p-3 rounded-md mt-2 text-accent">
                {gameState.game_code}
              </p>{" "}
            </div>
          );
        case "placing_ships":
          const isMyTurnToPlace = localPlayerId === gameState.current_turn;
          if (isMyTurnToPlace) {
            return (
              <SetupScreen
                key={localPlayer.id}
                player={localPlayer}
                gameState={gameState}
                onPlacementComplete={handleOnlinePlacementComplete}
                onShowAlert={handleShowAlert}
              />
            );
          } else {
            return (
              <div>
                {" "}
                <h2 className="text-2xl text-accent mb-4">
                  {" "}
                  Aguardando o oponente posicionar a frota...{" "}
                </h2>{" "}
              </div>
            );
          }
        case "battle":
          return (
            <BattleScreen
              gameState={gameState}
              onFireShot={handleFireShot}
              onSurrender={handleSurrender}
              currentPlayer={gameState.players.find(
                (p) => p.id === gameState.current_turn
              )}
              playerMode={playerMode}
              localPlayerId={localPlayerId}
              onShowAbilities={() => setShowAbilities(true)}
              targetingMode={targetingMode}
              onRowOrColClick={handleSelectTorpedoTarget}
            />
          );
        default:
          return <p>Estado de jogo desconhecido...</p>;
      }
    }

    switch (gamePhase) {
      case "menu":
        return <StartMenu onStartGame={handleStartGame} />;
      case "pvpMenu":
        return (
          <PvpMenu
            onSelectMode={handleStartGame}
            onBack={() => setGamePhase("menu")}
          />
        );
      case "nameEntry":
        return (
          <NameEntryScreen
            playerMode={playerMode}
            onNamesSubmitted={handleNamesSubmitted}
          />
        );
      case "placing":
        if (showTurnSwitch) {
          const nextPlayer = gameState.players.find(
            (p) => p.id !== placingPlayerId
          );
          return (
            <TurnSwitchScreen
              nextPlayerName={nextPlayer?.name}
              onReady={handleTurnSwitchReady}
            />
          );
        }
        const playerToPlace = gameState.players.find(
          (p) => p.id === placingPlayerId
        );
        if (!playerToPlace) return <p>Carregando...</p>;
        return (
          <SetupScreen
            key={playerToPlace.id}
            player={playerToPlace}
            gameState={gameState}
            onPlacementComplete={handlePlacementComplete}
            onShowAlert={handleShowAlert}
          />
        );
      case "battle":
        if (!gameState) return <p>Preparando Batalha...</p>;
        return (
          <BattleScreen
            gameState={gameState}
            onFireShot={handleFireShot}
            onSurrender={handleSurrender}
            currentPlayer={gameState.players.find(
              (p) => p.id === gameState.current_turn
            )}
            playerMode={playerMode}
            onShowAbilities={() => setShowAbilities(true)}
            targetingMode={targetingMode}
            onRowOrColClick={handleSelectTorpedoTarget}
          />
        );
      default:
        return <p>Error in game flow.</p>;
    }
  };

  const showBackButton =
    gamePhase === "pvpMenu" ||
    gamePhase === "nameEntry" ||
    (playerMode === "online" && !gameState);

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-8">
      <div className="absolute top-4 left-4 z-50">
        {showBackButton && (
          <button
            onClick={handleGoToMenu}
            className="text-accent text-3xl font-bold hover:text-white transition-colors"
            title="Voltar ao Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {" "}
              <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />{" "}
            </svg>
          </button>
        )}
      </div>

      {/* --- UPDATED ICON VISIBILITY --- */}
      {!gameState && (
        <div className="absolute top-4 right-4 z-50 flex gap-4">
          <button
            onClick={handleShowLeaderboard}
            className="text-accent text-3xl font-bold hover:text-white transition-colors"
            title="Placar de Líderes"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {" "}
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l.425.425a.5.5 0 0 1-.707.707L8 15.146l-1.252 1.252a.5.5 0 0 1-.707-.707l.425-.425v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935zM8 13.79l.879.879-.879.879-.879-.879L8 13.79zM8 1a1 1 0 0 0-1 1v2.646c.346-.066.692-.1 1.038-.1s.692.034 1.038.1V2a1 1 0 0 0-1-1z" />{" "}
            </svg>
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="text-accent text-3xl font-bold hover:text-white transition-colors"
            title="Ajuda"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {" "}
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />{" "}
              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z" />{" "}
            </svg>
          </button>
        </div>
      )}
      {/* --- END UPDATE --- */}

      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest">
            BATALHA-NAVAL
          </h1>
          <p className="text-accent mt-2">O CLÁSSICO JOGO BATALHA NAVAL</p>
        </div>
        <AIChat />
        {renderContent()}
        {gameState && gameState.winner && (
          <GameOverScreen gameState={gameState} onPlayAgain={handlePlayAgain} />
        )}
        {showLeaderboard && (
          <LeaderboardModal
            data={leaderboardData}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        {showAbilities && (
          <AbilitiesModal
            player={gameState.players.find(
              (p) => p.id === gameState.current_turn
            )}
            onClose={() => setShowAbilities(false)}
            onUseScout={() => handleUseAbility("scout")}
            onUseEMP={() => handleUseAbility("emp")}
            onUseTorpedo={() => {
              setShowAbilities(false);
              setShowTorpedoConfirm(true);
            }}
          />
        )}
        {showTorpedoConfirm && (
          <ConfirmModal
            message="Escolha o eixo do torpedo:"
            confirmText="Coluna"
            cancelText="Linha"
            onConfirm={() => {
              setTargetingMode("torpedo_col");
              setShowTorpedoConfirm(false);
            }}
            onClose={() => {
              setTargetingMode("torpedo_row");
              setShowTorpedoConfirm(false);
            }}
          />
        )}
      </div>
    </main>
  );
}

export default App;
