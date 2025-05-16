function createPlayer(name, mark, winStatus) {
  return { name, mark, winStatus };
}

const Gameboard = (function () {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const getBoard = () => board;
  const getNumberOfEmptyCells = () => {
    let oneDimBoard = [];
    for (let i = 0; i < board.length; i++) {
      oneDimBoard = oneDimBoard.concat(board[i]);
    }
    let numberOfEmptyCells = oneDimBoard.filter((item) => item === "").length;
    return numberOfEmptyCells;
  };
  const isEmptyCell = (row, column) => board[row][column] === "";
  return { getBoard, isEmptyCell, getNumberOfEmptyCells };
})();

const Control = (function () {
  let turnNumber = 1;
  let currentPlayer;
  // let endGame = false;
  let numberOfEmptyCells = Gameboard.getNumberOfEmptyCells();
  const updateTurnNumber = () => turnNumber++;
  const playTurn = (rowPos, columnPos) => {
    let board = Gameboard.getBoard();
    // do {
    //   rowPos = Number(prompt("Enter the number of row (between 0 and 2):"));
    //   columnPos = Number(
    //     prompt("Enter the number of column (between 0 and 2):")
    //   );
    //   incorrectRowPosFlag =
    //     isNaN(rowPos) || rowPos < 0 || rowPos >= board.length;
    //   incorrectColumnPosFlag =
    //     isNaN(columnPos) || columnPos < 0 || columnPos >= board.length;
    // } while (incorrectRowPosFlag || incorrectColumnPosFlag);

    currentPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
    board[rowPos][columnPos] = currentPlayer.mark;
    numberOfEmptyCells -= 1;
    DOMGameBoard.updateBoard();
    playerOne.winStatus = checkWinPositions(playerOne.mark);
    playerTwo.winStatus = checkWinPositions(playerTwo.mark);
    const resultField = document.querySelector(".result");
    if (playerOne.winStatus) {
      resultField.textContent = `${playerOne.name} wins!`;
    } else if (playerTwo.winStatus) {
      resultField.textContent = `${playerTwo.name} wins!`;
    } else if (numberOfEmptyCells === 0) {
      resultField.textContent = "Tie!";
    } else {
      updateTurnNumber();
      const newPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
      const currentPlayerField = document.querySelector(".player-turn");
      currentPlayerField.textContent = `${newPlayer.name}'s turn. Placing ${newPlayer.mark}`;
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

  return { playTurn };
})();

const DOMGameBoard = (function () {
  const drawBoard = (selectorName) => {
    const mainField = document.querySelector(selectorName);
    const board = Gameboard.getBoard();
    const gameBoardDOM = document.createElement("div");
    gameBoardDOM.classList.add("game-board");
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-column", j);
        if (i === 0) {
          if (j === 0) {
            cell.classList.add("first-row-first-cell");
          } else if (j === board[i].length - 1) {
            cell.classList.add("first-row-last-cell");
          } else {
            cell.classList.add("first-row");
          }
        } else if (i === board.length - 1) {
          if (j === 0) {
            cell.classList.add("last-row-first-cell");
          } else if (j === board[i].length - 1) {
            cell.classList.add("last-row-last-cell");
          } else {
            cell.classList.add("last-row");
          }
        } else {
          if (j === 0) {
            cell.classList.add("first-cell");
          } else if (j === board[i].length - 1) {
            cell.classList.add("last-cell");
          }
        }
        cell.addEventListener("click", (event) => {
          const rowNumber = Number(event.target.getAttribute("data-row"));
          const columnNumber = Number(event.target.getAttribute("data-column"));
          if (event.target.textContent.length === 0) {
            Control.playTurn(rowNumber, columnNumber);
          }
        });
        gameBoardDOM.appendChild(cell);
      }
      const currentPlayerField = document.querySelector(".player-turn");
      currentPlayerField.textContent = `${playerOne.name}'s turn. Placing ${playerOne.mark}`;
    }
    mainField.appendChild(gameBoardDOM);
  };
  const updateBoard = () => {
    const board = Gameboard.getBoard();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board.length; j++) {
        const specCell = document.querySelector(
          `.cell[data-row='${i}'][data-column='${j}']`
        );
        specCell.textContent = board[i][j];
      }
    }
  };

  return { drawBoard, updateBoard };
})();

const playerOne = createPlayer("Player 1", "X", false);
const playerTwo = createPlayer("Player 2", "O", false);
DOMGameBoard.drawBoard(".game-container");
