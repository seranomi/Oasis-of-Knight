import "./App.css";
import "./assets/white-knight.svg";
import "./assets/black-knight.svg";

const BOARD_SIZE: number= 8;
const FILES: string[] = 
["a", "b", "c", "d", "e", "f", "g", "h", 
 "i", "j", "k", "l", "m", "n", "o", "p"]; //size 16

function App() {
  const board: { row: number; col: number; file: string; rank: number }[][]
  = Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => ({
      row,
      col,
      file: FILES[col],
      rank: BOARD_SIZE - row,
    }))
  );

  return (
    <div className="app">
      <div className="board"
      style={{ "--board-size": BOARD_SIZE } as React.CSSProperties}>
        {board.flat().map((cell) => {
          const isDark = (cell.row + cell.col) % 2 === 1;
          const knightPosition = { row: 7, col: 1 };
          const isKnightHere =
            cell.row === knightPosition.row && cell.col === knightPosition.col;
          return (
            <div
              key={`${cell.row}-${cell.col}`}
              className={`cell ${isDark ? "dark" : "light"}`}
            >
              {cell.col === 0 && (
                <span className="cell-rank">{cell.rank}</span>
              )}

              {cell.row === BOARD_SIZE - 1 && (
                <span className="cell-file">{cell.file}</span>
              )}
              {isKnightHere && (
  <img src="./assets/white-knight.svg" alt="White Knight" className="piece" />
)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;