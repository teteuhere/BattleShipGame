import React from "react";

const Cell = ({
  cell,
  onClick,
  isInteractive,
  isScouted,
  scoutHasShip,
  isTorpedoPath,
  isSalvoTarget,
}) => {
  const baseStyle =
    "w-8 h-8 md:w-10 md:h-10 border border-slate/20 flex items-center justify-center font-bold text-xl select-none transition-all duration-300";
  let stateStyle = "bg-navy/50";
  let content = "";

  if (isScouted) {
    stateStyle = "bg-blue-500/40 animate-pulse";
    if (scoutHasShip) content = "❓";
  }

  if (isTorpedoPath) {
    stateStyle += " bg-purple-500/30";
  }

  if (isSalvoTarget) {
    stateStyle = "bg-amber-500/50 border-amber-300";
    content = "🎯";
  }

  if (cell.state === "hit") {
    stateStyle = "bg-red-500/50";
    content = "🔥";
  } else if (cell.state === "miss") {
    stateStyle = "bg-slate-700/50";
    content = "●";
  } else if (cell.hasShip) {
    stateStyle = "bg-accent/70";
  }

  if (isInteractive && cell.state === "empty" && !isScouted) {
    stateStyle += " hover:bg-light-navy cursor-pointer";
  }

  return (
    <div className={`${baseStyle} ${stateStyle}`} onClick={onClick}>
      <span
        className={`text-sm md:text-xl ${
          cell.state === "miss" ? "text-white/50" : ""
        } ${isScouted ? "text-blue-300" : ""}`}
      >
        {content}
      </span>
    </div>
  );
};

const GameBoard = ({
  gameState,
  grid,
  onCellClick,
  isInteractive = false,
  scoutedCells = [],
  torpedoPath = null,
  targetingMode = null,
  onRowOrColClick,
  salvoTargets = [],
}) => {
  if (!gameState) return null; // Don't render if there's no game state
  const { board_width, board_height } = gameState;

  if (!Array.isArray(grid)) {
    console.error("GameBoard received an invalid grid prop:", grid);
    return null;
  }

  const scoutedMap = new Map(
    scoutedCells.map((cell) => [
      `${cell.coords[0]}-${cell.coords[1]}`,
      cell.has_ship,
    ])
  );
  const salvoSet = new Set(salvoTargets.map((t) => `${t[0]}-${t[1]}`));
  const isTorpedoTargeting =
    targetingMode === "torpedo_row" || targetingMode === "torpedo_col";

  return (
    <div className="overflow-x-auto rounded-lg p-1 bg-navy/50">
      <div className="flex gap-2 w-max">
        {" "}
        {/* w-max ensures the container doesn't shrink */}
        <div className="flex flex-col gap-1 items-center justify-around">
          {Array.from({ length: board_height }).map((_, i) => (
            <div
              key={`row-label-${i}`}
              onClick={() =>
                isTorpedoTargeting &&
                targetingMode === "torpedo_row" &&
                onRowOrColClick("row", i)
              }
              className={`w-6 h-8 md:h-10 flex items-center justify-center text-xs text-slate ${
                isTorpedoTargeting && targetingMode === "torpedo_row"
                  ? "bg-light-navy hover:bg-accent hover:text-navy rounded cursor-pointer text-accent"
                  : ""
              }`}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${board_width}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: board_width }).map((_, i) => (
              <div
                key={`col-label-${i}`}
                onClick={() =>
                  isTorpedoTargeting &&
                  targetingMode === "torpedo_col" &&
                  onRowOrColClick("col", i)
                }
                className={`w-8 h-6 md:w-10 flex items-center justify-center text-xs text-slate ${
                  isTorpedoTargeting && targetingMode === "torpedo_col"
                    ? "bg-light-navy hover:bg-accent hover:text-navy rounded cursor-pointer text-accent"
                    : ""
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div
            className="grid gap-1 p-2 bg-navy rounded-md shadow-lg"
            style={{
              gridTemplateColumns: `repeat(${board_width}, minmax(0, 1fr))`,
            }}
          >
            {grid.flat().map((cell, index) => {
              const row = Math.floor(index / board_width);
              const col = index % board_width;
              const scoutKey = `${row}-${col}`;
              const isScouted = scoutedMap.has(scoutKey);
              const scoutHasShip = isScouted ? scoutedMap.get(scoutKey) : false;
              const isTorpedoPath =
                torpedoPath &&
                ((torpedoPath.type === "row" && torpedoPath.index === row) ||
                  (torpedoPath.type === "col" && torpedoPath.index === col));
              const isSalvoTarget = salvoSet.has(`${row}-${col}`);

              return (
                <Cell
                  key={index}
                  cell={cell}
                  isInteractive={isInteractive}
                  isScouted={isScouted}
                  scoutHasShip={scoutHasShip}
                  isTorpedoPath={isTorpedoPath}
                  isSalvoTarget={isSalvoTarget}
                  onClick={() => {
                    if (isInteractive && cell.state === "empty") {
                      onCellClick(row, col);
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
