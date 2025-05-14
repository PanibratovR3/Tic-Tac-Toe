function createPlayer(name, mark) {
  return { name, mark };
}

const Gameboard = (function () {
  const board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  const isEmptyCell = (row, column) => board[row][column] === "-";
  return { board, isEmptyCell };
})();

const Control = (function () {
  let turnNumber = 1;
  let currentPlayer;

  const playTurn = () => {
    let rowPos;
    let columnPos;
    let incorrectRowPosFlag;
    let incorrectColumnPosFlag;

    do {
      rowPos = Number(prompt("Enter the number of row (between 0 and 2):"));
      columnPos = Number(
        prompt("Enter the number of column (between 0 and 2):")
      );
      incorrectRowPosFlag =
        isNaN(rowPos) || rowPos < 0 || rowPos >= Gameboard.board.length;
      incorrectColumnPosFlag =
        isNaN(columnPos) ||
        columnPos < 0 ||
        columnPos >= Gameboard.board.length;
    } while (incorrectRowPosFlag || incorrectColumnPosFlag);

    currentPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
    console.log(`${currentPlayer.name}'s move.`);
    if (Gameboard.isEmptyCell(rowPos, columnPos)) {
      Gameboard.board[rowPos][columnPos] = currentPlayer.mark;
      console.log(Gameboard.board);
    }
    turnNumber++;
  };

  const checkWinPositions = (mark) => {
    const firstRow = Gameboard.board[0];
    const secondRow = Gameboard.board[1];
    const thirdRow = Gameboard.board[2];

    const firstColumn = [
      Gameboard.board[0][0],
      Gameboard.board[1][0],
      Gameboard.board[2][0],
    ];
    const secondColumn = [
      Gameboard.board[0][1],
      Gameboard.board[1][1],
      Gameboard.board[2][1],
    ];
    const thirdColumn = [
      Gameboard.board[0][2],
      Gameboard.board[1][2],
      Gameboard.board[2][2],
    ];
    const firstDiagonal = [
      Gameboard.board[0][0],
      Gameboard.board[1][1],
      Gameboard.board[2][2],
    ];
    const secondDiagonal = [
      Gameboard.board[0][2],
      Gameboard.board[1][1],
      Gameboard.board[2][0],
    ];
    const rowFlag =
      firstRow.every((item) => item === mark) ||
      secondRow.every((item) => item === mark) ||
      thirdRow.every((item) => item === mark);

    const columnFlag =
      firstColumn.every((item) => item === mark) ||
      secondColumn.every((item) => item === mark) ||
      thirdColumn.every((item) => item === mark);

    const diagonalFlag =
      firstDiagonal.every((item) => item === mark) ||
      secondDiagonal.every((item) => item === mark);

    return rowFlag || columnFlag || diagonalFlag;
  };

  return { playTurn, checkWinPositions };
})();

const playerOne = createPlayer("Player 1", "X");
const playerTwo = createPlayer("Player 2", "O");

// console.log(Control.checkWinPositions("X"));
// Control.playTurn();
// Control.playTurn();
