import React, { useState, useMemo } from "react";
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
} from "../api.js"; // Import getLeaderboard
import HelpModal from "./components/HelpModal.jsx";
import AIChat from "./components/AIChat.jsx";
import AlertModal from "./components/AlertModal.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx"; // Import the new modal
import LeaderboardModal from "./components/LeaderboardModal.jsx"; // Import the leaderboard modal

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gamePhase, setGamePhase] = useState("menu");
  const [gameMode, setGameMode] = useState("pvp");
  const [placingPlayerId, setPlacingPlayerId] = useState(null);
  const [showTurnSwitch, setShowTurnSwitch] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // New state for confirmation and leaderboard modals
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
  };

  const placingPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find((p) => p.id === placingPlayerId);
  }, [gameState, placingPlayerId]);

  const nextPlayer = useMemo(() => {
    if (!gameState) return null;
    return gameState.players.find((p) => p.id !== placingPlayerId);
  }, [gameState, placingPlayerId]);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGamePhase("nameEntry");
  };

  const handleNamesSubmitted = async (playerNames) => {
    setIsLoading(true);
    setError(null);
    try {
      const newGame = await createGame(gameMode, playerNames);
      setGameState(newGame);
      const firstPlayer = newGame.players.find((p) => !p.is_ai);
      if (firstPlayer) {
        setPlacingPlayerId(firstPlayer.id);
      }
      setGamePhase("placing");
    } catch (err) {
      setError(
        "Falha ao iniciar um novo jogo. Verifique se o servidor backend está rodando!"
      );
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

      if (gameMode === "pvp") {
        const firstPlayer = gameState.players.find((p) => !p.is_ai);
        const isFirstPlayerTurn = placingPlayer.id === firstPlayer.id;

        if (isFirstPlayerTurn) {
          setShowTurnSwitch(true);
        } else {
          const response = await fetch(
            `http://localhost:8000/api/games/${gameState.id}/`
          );
          const updatedGame = await response.json();
          setGameState(updatedGame);
          setGamePhase("battle");
        }
      } else {
        const response = await fetch(
          `http://localhost:8000/api/games/${gameState.id}/`
        );
        const updatedGame = await response.json();
        setGameState(updatedGame);
        setGamePhase("battle");
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
      const response = await fireShot(gameState.id, gameState.current_turn, [
        row,
        col,
      ]);
      setGameState(response.game_state);
      if (response.shot_result && response.shot_result.message) {
        setAlertMessage(response.shot_result.message);
      }
    } catch (err) {
      setError(
        "Erro ao disparar. O inimigo pode ter bloqueado nossos sistemas!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAgain = () => {
    setGameState(null);
    setGamePhase("menu");
    setPlacingPlayerId(null);
    setShowTurnSwitch(false);
    setError(null);
  };

  const handleGoToMenu = () => {
    setConfirmModal({
      isOpen: true,
      message:
        "Tem certeza que deseja voltar ao menu principal? O progresso do jogo atual será perdido.",
      onConfirm: () => {
        handlePlayAgain(); // Resets the game state
        setConfirmModal({ isOpen: false, message: "", onConfirm: null });
      },
    });
  };

  const handleSurrender = (playerId) => {
    setConfirmModal({
      isOpen: true,
      message: "Tem certeza de que deseja se render?",
      onConfirm: async () => {
        setIsLoading(true);
        setError(null);
        try {
          const updatedGameState = await surrenderGame(gameState.id, playerId);
          setGameState(updatedGameState);
        } catch (err) {
          setError(
            "Erro ao se render. O oponente pode ter bloqueado nossos sistemas!"
          );
        } finally {
          setIsLoading(false);
          setConfirmModal({ isOpen: false, message: "", onConfirm: null });
        }
      },
    });
  };

  const handleShowLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
      setShowLeaderboard(true);
    } catch (err) {
      handleShowAlert(
        "Não foi possível carregar o placar de líderes. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading && !showLeaderboard) {
      // Don't show global loading when opening leaderboard
      return <p className="text-accent animate-pulse">Carregando Missão...</p>;
    }
    if (error) {
      return <p className="text-red-500 font-bold">{error}</p>;
    }
    if (showTurnSwitch) {
      return (
        <TurnSwitchScreen
          nextPlayerName={nextPlayer?.name}
          onReady={handleTurnSwitchReady}
        />
      );
    }

    switch (gamePhase) {
      case "battle":
        if (!gameState) {
          return (
            <p className="text-accent animate-pulse">
              Preparando para a Batalha...
            </p>
          );
        }
        return (
          <BattleScreen
            gameState={gameState}
            onFireShot={handleFireShot}
            gameMode={gameMode}
            onSurrender={handleSurrender}
          />
        );
      case "nameEntry":
        return (
          <NameEntryScreen
            gameMode={gameMode}
            onNamesSubmitted={handleNamesSubmitted}
          />
        );
      case "placing":
        if (!placingPlayer) {
          return (
            <p className="text-accent animate-pulse">
              Carregando Dados do Jogador...
            </p>
          );
        }
        return (
          <SetupScreen
            key={placingPlayer.id}
            player={placingPlayer}
            onPlacementComplete={handlePlacementComplete}
            onShowAlert={handleShowAlert}
          />
        );
      case "menu":
      default:
        return <StartMenu onStartGame={handleStartGame} />;
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center p-8">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showLeaderboard && (
        <LeaderboardModal
          data={leaderboardData}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
      <div className="max-w-7xl mx-auto text-center">
        <div className="absolute top-4 left-4 z-50">
          {gamePhase !== "menu" && (
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
                <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </button>
          )}
        </div>

        <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
          <button
            onClick={handleShowLeaderboard}
            className="text-accent text-3xl font-bold hover:text-white transition-colors"
            title="Placar de Líderes"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M2.5.5A.5.5 0 0 1 3 .5V2h10V.5a.5.5 0 0 1 1 0v1.5a2.5 2.5 0 0 1-2.5 2.5H3A2.5 2.5 0 0 1 .5 2V1a.5.5 0 0 1 .5-.5zM3 12.5a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 13 12.5v1.5a.5.5 0 0 1-1 0v-1.5a1.5 1.5 0 0 0-1.5-1.5h-5A1.5 1.5 0 0 0 3 12.5v1.5a.5.5 0 0 1-1 0v-1.5z" />
              <path d="M4 11H2v1.5a.5.5 0 0 1-1 0V5h1v5.5a.5.5 0 0 1 .5.5zm8 0h2V5h-1v6.5a.5.5 0 0 1-.5.5zM6 11h4V5H6v6z" />
            </svg>
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="text-accent text-3xl font-bold hover:text-white transition-colors"
          >
            ?
          </button>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-widest">
            BATALHA-NAVAL
          </h1>
          <p className="text-accent mt-2">O CLÁSSICO JOGO BATALHA NAVAL</p>
        </div>
        <AIChat />
        {renderContent()}
        {alertMessage && (
          <AlertModal
            message={alertMessage}
            onClose={() => setAlertMessage("")}
          />
        )}
        {confirmModal.isOpen && (
          <ConfirmModal
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onClose={() =>
              setConfirmModal({ isOpen: false, message: "", onConfirm: null })
            }
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
