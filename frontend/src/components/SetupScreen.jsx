// BattleShipGame/frontend/src/components/SetupScreen.jsx

import React, { useState, useMemo, useEffect } from 'react';
import GameBoard from './GameBoard.jsx';

const SHIPS_TO_PLACE = [
    { name: 'Porta-aviões', length: 5 },
    { name: 'Navio-tanque', length: 4 },
    { name: 'Cruzador', length: 3 },
    { name: 'Submarino', length: 3 },
    { name: 'Destruidor', length: 2 },
];
  
function SetupScreen({ player, onPlacementComplete }) {
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState('horizontal');
  const [placedShips, setPlacedShips] = useState([]);

  useEffect(() => {
    setCurrentShipIndex(0);
    setPlacedShips([]);
    setOrientation('horizontal');
  }, [player]);

  const grid = useMemo(() => {
    const newGrid = Array(10).fill(null).map(() => 
      Array(10).fill(null).map(() => ({ state: 'empty', hasShip: false }))
    );

    placedShips.forEach(ship => {
      ship.coordinates.forEach(([row, col]) => {
        if (newGrid[row] && newGrid[row][col]) {
            newGrid[row][col].hasShip = true;
        }
      });
    });

    return newGrid;
  }, [placedShips]);

  const handleCellClick = (row, col) => {
    if (currentShipIndex >= SHIPS_TO_PLACE.length) return;

    const currentShip = SHIPS_TO_PLACE[currentShipIndex];
    let startRow = row;
    let startCol = col;

    if (orientation === 'horizontal' && col + currentShip.length > 10) {
        startCol = 10 - currentShip.length;
    }
    if (orientation === 'vertical' && row + currentShip.length > 10) {
        startRow = 10 - currentShip.length;
    }

    const newShipCoordinates = [];
    for (let i = 0; i < currentShip.length; i++) {
        const newRow = orientation === 'vertical' ? startRow + i : startRow;
        const newCol = orientation === 'horizontal' ? startCol + i : startCol;

        if (grid[newRow][newCol].hasShip) {
            alert("Posicionamento inválido: os navios não podem se sobrepor!");
            return;
        }
        newShipCoordinates.push([newRow, newCol]);
    }

    setPlacedShips([...placedShips, { ship_type: currentShip.name, coordinates: newShipCoordinates }]);
    setCurrentShipIndex(currentShipIndex + 1);
  };
  
  const allShipsPlaced = currentShipIndex >= SHIPS_TO_PLACE.length;

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in">
      <div>
        {/* Esta linha agora exibirá o nome correto */}
        <p className="text-xl text-light-slate mb-2">Turno: {player.name}</p>
        <h2 className="text-2xl text-accent mb-2">
          {allShipsPlaced ? "Frota posicionada!" : `Posicionando: ${SHIPS_TO_PLACE[currentShipIndex].name}`}
        </h2>
        <p className="text-slate">Clique no tabuleiro para posicionar seus navios.</p>
      </div>

      <GameBoard 
        grid={grid} 
        onCellClick={handleCellClick}
        isInteractive={true}
       />

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setOrientation(o => o === 'horizontal' ? 'vertical' : 'horizontal')}
          className="bg-light-navy text-white font-bold py-2 px-4 rounded"
        >
          Rotacionar ({orientation === 'horizontal' ? 'Horizontal' : 'Vertical'})
        </button>
        <button
          onClick={() => onPlacementComplete(placedShips)}
          disabled={!allShipsPlaced}
          className={`font-bold py-2 px-4 rounded ${!allShipsPlaced ? 'bg-slate/20 text-slate/50 cursor-not-allowed' : 'bg-accent text-navy'}`}
        >
          Confirmar Posicionamento
        </button>
      </div>
    </div>
  );
}

export default SetupScreen;