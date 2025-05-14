function createPlayer(name, mark, winStatus) {
  return { name, mark, winStatus };
}

const Gameboard = (function () {
  const board = [
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ];
  const getBoard = () => board;
  const isEmptyCell = (row, column) => board[row][column] === "-";
  return { getBoard, isEmptyCell };
})();

const Control = (function () {
  let turnNumber = 1;
  let currentPlayer;
  let endGame = false;

  const playTurn = () => {
    let rowPos;
    let columnPos;
    let incorrectRowPosFlag;
    let incorrectColumnPosFlag;
    let board = Gameboard.getBoard();
    do {
      rowPos = Number(prompt("Enter the number of row (between 0 and 2):"));
      columnPos = Number(
        prompt("Enter the number of column (between 0 and 2):")
      );
      incorrectRowPosFlag =
        isNaN(rowPos) || rowPos < 0 || rowPos >= board.length;
      incorrectColumnPosFlag =
        isNaN(columnPos) || columnPos < 0 || columnPos >= board.length;
    } while (incorrectRowPosFlag || incorrectColumnPosFlag);

    currentPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
    console.log(`${currentPlayer.name}'s move.`);
    if (Gameboard.isEmptyCell(rowPos, columnPos)) {
      board[rowPos][columnPos] = currentPlayer.mark;
      console.log(board);
      playerOne.winStatus = checkWinPositions(playerOne.mark);
      playerTwo.winStatus = checkWinPositions(playerTwo.mark);
      endGame = playerOne.winStatus || playerTwo.winStatus;
      turnNumber++;
    }
  };

  const playGame = () => {
    while (!endGame) {
      playTurn();
    }
    if (playerOne.winStatus) {
      console.log(`${playerOne.name} wins.`);
    } else if (playerTwo.winStatus) {
      console.log(`${playerTwo.name} wins`);
    }
  };

  const checkWinPositions = (mark) => {
    const board = Gameboard.getBoard();
    const firstRow = board[0];
    const secondRow = board[1];
    const thirdRow = board[2];

    const firstColumn = [board[0][0], board[1][0], board[2][0]];
    const secondColumn = [board[0][1], board[1][1], board[2][1]];
    const thirdColumn = [board[0][2], board[1][2], board[2][2]];
    const firstDiagonal = [board[0][0], board[1][1], board[2][2]];
    const secondDiagonal = [board[0][2], board[1][1], board[2][0]];
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

  return { playGame };
})();

const playerOne = createPlayer("Player 1", "X", false);
const playerTwo = createPlayer("Player 2", "O", false);

Control.playGame();
// console.log(Control.checkWinPositions("X"));
// Control.playTurn();
// Control.playTurn();
