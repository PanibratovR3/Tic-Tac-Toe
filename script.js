function createPlayer(name, mark, winStatus) {
  return { name, mark, winStatus };
}

const Gameboard = (function () {
  const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const getNumberOfEmptyCells = () => {
    let oneDimBoard = [];
    for (let i = 0; i < board.length; i++) {
      oneDimBoard = oneDimBoard.concat(board[i]);
    }
    let numberOfEmptyCells = oneDimBoard.filter((item) => item === "").length;
    return numberOfEmptyCells;
  };
  const setMark = (rowPos, colPos, mark) => (board[rowPos][colPos] = mark);
  const getMark = (rowPos, colPos) => board[rowPos][colPos];
  const getRow = (rowPos) => board[rowPos];
  const getSize = () => board.length;
  const getRowSize = (rowNumber) => board[rowNumber].length;
  const resetGameBoard = () => {
    for (let i = 0; i < getSize(); i++) {
      for (let j = 0; j < getRowSize(i); j++) {
        setMark(i, j, "");
      }
    }
    console.log(board);
  };
  return {
    setMark,
    getMark,
    getRow,
    getSize,
    getRowSize,
    getNumberOfEmptyCells,
    resetGameBoard,
  };
})();

const Control = (function () {
  let turnNumber = 1;
  let currentPlayer;
  let numberOfEmptyCells = Gameboard.getNumberOfEmptyCells();
  const setNumberOfEmptyCells = () =>
    (numberOfEmptyCells = Gameboard.getNumberOfEmptyCells());
  let updateNumberOfEmptyCells = () => numberOfEmptyCells--;
  const updateTurnNumber = () => turnNumber++;
  const resetTurnNumber = () => (turnNumber = 1);
  const resetCurrentPlayer = () => (currentPlayer = null);
  const playTurn = (rowPos, columnPos) => {
    currentPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
    Gameboard.setMark(rowPos, columnPos, currentPlayer.mark);
    updateNumberOfEmptyCells();
    DOMGameBoard.updateBoard();
    playerOne.winStatus = checkWinPositions(playerOne.mark);
    playerTwo.winStatus = checkWinPositions(playerTwo.mark);
    const resultField = document.querySelector(".result");
    if (playerOne.winStatus) {
      resultField.textContent = `${playerOne.name} wins!`;
      DOMGameBoard.disableBoard();
    } else if (playerTwo.winStatus) {
      resultField.textContent = `${playerTwo.name} wins!`;
      DOMGameBoard.disableBoard();
    } else if (numberOfEmptyCells === 0) {
      resultField.textContent = "Tie!";
    } else {
      updateTurnNumber();
      const newPlayer = turnNumber % 2 !== 0 ? playerOne : playerTwo;
      const currentPlayerField = document.querySelector(".player-turn");
      currentPlayerField.innerHTML = `${newPlayer.name}'s turn. Placing <span class='mark-turn'>${newPlayer.mark}</span>`;
    }
  };

  const checkWinPositions = (mark) => {
    const firstRow = Gameboard.getRow(0);
    const secondRow = Gameboard.getRow(1);
    const thirdRow = Gameboard.getRow(2);

    const firstColumn = [
      Gameboard.getMark(0, 0),
      Gameboard.getMark(1, 0),
      Gameboard.getMark(2, 0),
    ];
    const secondColumn = [
      Gameboard.getMark(0, 1),
      Gameboard.getMark(1, 1),
      Gameboard.getMark(2, 1),
    ];
    const thirdColumn = [
      Gameboard.getMark(0, 2),
      Gameboard.getMark(1, 2),
      Gameboard.getMark(2, 2),
    ];

    const firstDiagonal = [
      Gameboard.getMark(0, 0),
      Gameboard.getMark(1, 1),
      Gameboard.getMark(2, 2),
    ];
    const secondDiagonal = [
      Gameboard.getMark(0, 2),
      Gameboard.getMark(1, 1),
      Gameboard.getMark(2, 0),
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

  return {
    playTurn,
    resetTurnNumber,
    resetCurrentPlayer,
    setNumberOfEmptyCells,
  };
})();

const DOMGameBoard = (function () {
  const handlerClick = (event) => {
    const rowNumber = Number(event.target.getAttribute("data-row"));
    const columnNumber = Number(event.target.getAttribute("data-column"));
    if (event.target.textContent.length === 0) {
      Control.playTurn(rowNumber, columnNumber);
    }
  };
  const drawBoard = (selectorName) => {
    const mainField = document.querySelector(selectorName);
    const gameBoardDOM = document.createElement("div");
    gameBoardDOM.classList.add("game-board");
    for (let i = 0; i < Gameboard.getSize(); i++) {
      for (let j = 0; j < Gameboard.getRowSize(i); j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", i);
        cell.setAttribute("data-column", j);
        if (i === 0) {
          if (j === 0) {
            cell.classList.add("first-row-first-cell");
          } else if (j === Gameboard.getRowSize(i) - 1) {
            cell.classList.add("first-row-last-cell");
          } else {
            cell.classList.add("first-row");
          }
        } else if (i === Gameboard.getSize() - 1) {
          if (j === 0) {
            cell.classList.add("last-row-first-cell");
          } else if (j === Gameboard.getRowSize(i) - 1) {
            cell.classList.add("last-row-last-cell");
          } else {
            cell.classList.add("last-row");
          }
        } else {
          if (j === 0) {
            cell.classList.add("first-cell");
          } else if (j === Gameboard.getRowSize(i) - 1) {
            cell.classList.add("last-cell");
          }
        }
        cell.addEventListener("click", handlerClick);
        gameBoardDOM.appendChild(cell);
      }
      const currentPlayerField = document.querySelector(".player-turn");
      currentPlayerField.innerHTML = `${playerOne.name}'s turn. Placing <span class='mark-turn'>${playerOne.mark}</span>.`;
    }
    mainField.appendChild(gameBoardDOM);
  };
  const updateBoard = () => {
    for (let i = 0; i < Gameboard.getSize(); i++) {
      for (let j = 0; j < Gameboard.getRowSize(i); j++) {
        const specCell = document.querySelector(
          `.cell[data-row='${i}'][data-column='${j}']`
        );
        specCell.textContent = Gameboard.getMark(i, j);
      }
    }
  };
  const disableBoard = () => {
    for (let i = 0; i < Gameboard.getSize(); i++) {
      for (let j = 0; j < Gameboard.getRowSize(i); j++) {
        const specCell = document.querySelector(
          `.cell[data-row='${i}'][data-column='${j}']`
        );
        specCell.removeEventListener("click", handlerClick);
      }
    }
  };
  const enableBoard = () => {
    for (let i = 0; i < Gameboard.getSize(); i++) {
      for (let j = 0; j < Gameboard.getRowSize(i); j++) {
        const specCell = document.querySelector(
          `.cell[data-row='${i}'][data-column='${j}']`
        );
        specCell.addEventListener("click", handlerClick);
      }
    }
  };
  const resetBoard = () => {
    Gameboard.resetGameBoard();
    updateBoard();
    Control.resetTurnNumber();
    Control.resetCurrentPlayer();
    Control.setNumberOfEmptyCells();
    if (playerOne.winStatus || playerTwo.winStatus) {
      enableBoard();
    }
    playerOne.winStatus = false;
    playerTwo.winStatus = false;
    document.querySelector(".result").textContent = "";
    document.querySelector(
      ".player-turn"
    ).innerHTML = `${playerOne.name}'s turn. Placing <span class='mark-turn'>${playerOne.mark}</span>.`;
  };

  return { drawBoard, updateBoard, disableBoard, resetBoard };
})();

const playerOne = createPlayer("Player 1", "X", false);
const playerTwo = createPlayer("Player 2", "O", false);
DOMGameBoard.drawBoard(".game-container");
document
  .querySelector(".restart-button")
  .addEventListener("click", () => DOMGameBoard.resetBoard());
