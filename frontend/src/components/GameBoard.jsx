/**
 * GameBoard.jsx - The Game Grid
 * This component is responsible for drawing the 10x10 grid. It's now updated
 * to be "interactive" (showing hover effects and accepting clicks) only when
 * explicitly told, which makes the game flow much more reliable.
 */
import React from 'react';

const Cell = ({ cell, onClick, isInteractive }) => {
  const baseStyle = "w-8 h-8 md:w-10 md:h-10 border border-slate/20 flex items-center justify-center font-bold text-xl select-none";
  let stateStyle = "bg-navy/50";
  let content = '';

  if (cell.state === 'hit') {
    stateStyle = 'bg-red-500/50';
    content = '🔥';
  } else if (cell.state === 'miss') {
    stateStyle = 'bg-slate-700/50';
    content = '●';
  } else if (cell.hasShip) {
    stateStyle = "bg-accent/70";
  }
  
  // The hover effect and cursor are now controlled by the `isInteractive` prop.
  if (isInteractive && cell.state === 'empty') {
    stateStyle += " hover:bg-light-navy cursor-pointer";
  }

  return (
    <div className={`${baseStyle} ${stateStyle}`} onClick={onClick}>
      <span className={`text-sm md:text-xl ${cell.state === 'miss' ? 'text-white/50' : ''}`}>
        {content}
      </span>
    </div>
  );
};

const GameBoard = ({ grid, onCellClick, isInteractive = false }) => {
  if (!Array.isArray(grid)) {
    console.error("GameBoard received an invalid grid prop:", grid);
    return null;
  }

  return (
    <div className="grid grid-cols-10 gap-1 p-2 bg-navy rounded-md shadow-lg">
      {grid.flat().map((cell, index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        return (
          <Cell
            key={index}
            cell={cell}
            isInteractive={isInteractive}
            onClick={() => {
              if (isInteractive && cell.state === 'empty') {
                onCellClick(row, col);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;