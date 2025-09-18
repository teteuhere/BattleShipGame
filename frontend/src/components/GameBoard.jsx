import React from 'react';

// A simple component to render one 10x10 grid
const GameBoard = ({ title }) => {
  // Create an array of 100 cells to render the grid
  const cells = Array.from({ length: 100 });

  return (
    <div className="board-container">
      <h2>{title}</h2>
      <div className="game-board">
        {cells.map((_, index) => (
          <div key={index} className="cell">
            {/* We'll add logic here later for hits, misses, and ships */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;