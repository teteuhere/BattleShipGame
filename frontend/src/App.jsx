import { useState } from 'react';
import { createGame } from './api'; // Import our API function
import GameBoard from './components/GameBoard'; // We'll create this next
import './App.css'; // We'll add some styles

function App() {
  // 'useState' is a React Hook to hold our component's data (its "state")
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // This function is called when the "Start New Game" button is clicked
  const handleStartGame = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await createGame();
      setGameData(response.data); // Save the game data we get from the API
    } catch (err) {
      setError('Failed to start the game. Is the backend server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>🔥 Battleship 🔥</h1>
      {error && <p className="error-message">{error}</p>}
      
      {/* This is conditional rendering. It changes what's shown on screen. */}
      {!gameData ? (
        // If there's NO game data, show the start button
        <button onClick={handleStartGame} disabled={isLoading}>
          {isLoading ? 'Starting...' : 'Start New Game'}
        </button>
      ) : (
        // If we HAVE game data, show the game boards!
        <div className="game-layout">
          <GameBoard title="Your Fleet" />
          <GameBoard title="Enemy Waters" />
        </div>
      )}
    </div>
  );
}

export default App;