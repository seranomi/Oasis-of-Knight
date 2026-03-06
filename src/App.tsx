import { useState } from "react";
import "./App.css";
import whiteKnight from "./assets/white-knight.svg";

const BOARD_SIZE: number = 8;
const FILES: string[] = [
  "a", "b", "c", "d", "e", "f", "g", "h",
  "i", "j", "k", "l", "m", "n", "o", "p",
];

type Position = {
  row: number;
  col: number;
};

const KNIGHT_MOVES: Position[] = [
  { row: 2, col: 1 },
  { row: 2, col: -1 },
  { row: -2, col: 1 },
  { row: -2, col: -1 },
  { row: 1, col: 2 },
  { row: 1, col: -2 },
  { row: -1, col: 2 },
  { row: -1, col: -2 },
];

function isInsideBoard(position: Position, boardSize: number): boolean {
  return (
    position.row >= 0 &&
    position.row < boardSize &&
    position.col >= 0 &&
    position.col < boardSize
  );
}

function playMoveBeep() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "triangle";
  oscillator.frequency.value = 520;

  gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.12
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.12);
}

function App() {
  const [knightPosition, setKnightPosition] = useState<Position>({
    row: 4,
    col: 4,
  });

  const board: { row: number; col: number; file: string; rank: number }[][] =
    Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, col) => ({
        row,
        col,
        file: FILES[col],
        rank: BOARD_SIZE - row,
      }))
    );

  const validMoves: Position[] = KNIGHT_MOVES
    .map((move) => ({
      row: knightPosition.row + move.row,
      col: knightPosition.col + move.col,
    }))
    .filter((position) => isInsideBoard(position, BOARD_SIZE));

  function handleCellClick(cell: Position) {
    const isValidMove = validMoves.some(
      (move) => move.row === cell.row && move.col === cell.col
    );

    if (isValidMove) {
      playMoveBeep();
      setKnightPosition(cell);
    }
  }
  

  return (
    <div className="app">
      <div
        className="board"
        style={{ "--board-size": BOARD_SIZE } as React.CSSProperties}
      >
        {board.flat().map((cell) => {
          const isDark = (cell.row + cell.col) % 2 === 1;
          const isKnightHere =
            cell.row === knightPosition.row && cell.col === knightPosition.col;

          const isValidMove = validMoves.some(
            (move) => move.row === cell.row && move.col === cell.col
          );

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`cell ${isDark ? "dark" : "light"} ${
                isValidMove ? "clickable" : ""
              }`}
              onClick={() => handleCellClick({ row: cell.row, col: cell.col })}
            >
              {cell.col === 0 && (
                <span className="cell-rank">{cell.rank}</span>
              )}

              {cell.row === BOARD_SIZE - 1 && (
                <span className="cell-file">{cell.file}</span>
              )}

              {isValidMove && <div className="move-highlight" />}

              {isKnightHere && (
                <img
                  src={whiteKnight}
                  alt="White Knight"
                  className="piece"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;