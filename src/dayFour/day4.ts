const fs = require("fs");

const data: string[] = fs.readFileSync("inputday4.txt").toString().split("\n\n");
const numbersToDraw: number[] = data[0].split(",").map((x:string) => parseInt(x));

interface board {
    rows: number[][],
    cols: number[][]
};

function turnIntoRowArrays (data: string) {
  return data.split("\n").map((row) =>
    row
      .trim()
      .split(/\s+/g)
      .map((x) => parseInt(x))
  );
}

function convertToBoardObject (rows: number[][]) {
  return {
    rows,
    cols: rows[0].map((_, i) => rows.map((row) => row[i]))
  };
}

const boards: board[] = data.slice(1).map(turnIntoRowArrays).map(convertToBoardObject);
let winningRowOrCol: number[] = [];

function isBoardAWinner (boards: board[], numbersCalled: number[]): board|null {
  const isInCalledNums = (value:number) => numbersCalled.includes(value);
  let isInRow: boolean = false;
  let isInCol: boolean = false;
  let winner: board = { rows: [], cols: [] };
  boards.forEach(board => {
    board.rows.forEach(row => {
      if (row.every(isInCalledNums) === true) {
        isInRow = true;
        winner = board;
        winningRowOrCol = row;
      };
    });
    board.cols.forEach(col => {
      if (col.every(isInCalledNums) === true) {
        isInCol = true;
        winner = board;
        winningRowOrCol = col;
      };
    });
  });
  if (isInRow || isInCol) {
    return winner;
  }
  return null;
}

let winningBoard: board|null = null;

let i = 5;
let lastNumber: number = 0;
while (winningBoard === null && i < numbersToDraw.length) {
  const drawnNumbers: number[] = numbersToDraw.slice(0, i + 1);
  winningBoard = isBoardAWinner(boards, drawnNumbers);
  lastNumber = drawnNumbers[i];
  i++;
}

const reducer = (prevValue: number, currValue: number) => prevValue + currValue;
console.log(winningBoard);
winningBoard?.rows.forEach(row => {
  for (let i = 0; i < winningRowOrCol.length; i++) {
    if (row.includes(winningRowOrCol[i])) {
      const index = row.indexOf(winningRowOrCol[i]);
      row.splice(index, 1);
    }
  }
});

let sum = 0;

winningBoard?.rows.forEach(row => {
  sum += row.reduce(reducer);
});
console.log(winningBoard);
console.log(winningRowOrCol);
console.log(sum);
console.log(lastNumber);
console.log(sum * lastNumber);
