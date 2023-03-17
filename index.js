window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas");
  const context = canvas.getContext("2d");
  const { width, height } = canvas;

  const ROWS = 16;
  const COLS = 16;

  const CELL_WIDTH = width / COLS;
  const CELL_HEIGHT = height / ROWS;
  const LIGHT_GREEN = "#AAD751";
  const DARK_GREEN = "#A2D149";

  const Cell = (row, col) => ({ row, col });
  const Snake = (direction, cells) => ({ direction, cells });

  const Direction = {
    North: 0,
    South: 1,
    East: 2,
    West: 3,
  };

  let snake = Snake(Direction.East, [Cell(7, 4), Cell(7, 3)]);
  let apple = Cell(7, 12);
  let score = 0;

  const scoreDiv = document.getElementById("score");

  const equal = (a, b) => a.row === b.row && a.col == b.col;

  const drawCell = ({ row, col }) => {
    context.fillRect(
      col * CELL_WIDTH,
      row * CELL_HEIGHT,
      CELL_WIDTH,
      CELL_HEIGHT
    );
  };

  const drawBoard = () => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        context.fillStyle = row % 2 === col % 2 ? LIGHT_GREEN : DARK_GREEN;
        drawCell({ row, col });
      }
    }
  };

  const drawSnake = () => {
    context.fillStyle = "#4673E9";
    for (const cell of snake.cells) drawCell(cell);
  };

  const drawApple = () => {
    context.fillStyle = "#E7471D";
    drawCell(apple);
  };

  const drawFrame = () => {
    drawBoard();
    drawSnake();
    drawApple();
  };

  const random = (n) => Math.floor(Math.random() * n);
  const randomCell = () => Cell(random(ROWS), random(COLS));
  const randomApple = () => {
    let apple = randomCell();
    while (snake.cells.some((cell) => equal(cell, apple))) apple = randomCell();
    return apple;
  };

  const nextHead = () => {
    const {
      direction,
      cells: [{ row, col }],
    } = snake;

    switch (direction) {
      case Direction.North:
        return { row: row - 1, col };
      case Direction.South:
        return { row: row + 1, col };
      case Direction.East:
        return { row, col: col + 1 };
      case Direction.West:
        return { row, col: col - 1 };
    }
  };

  const moveSnake = () => {
    const head = nextHead();

    if (
      snake.cells.some((cell) => equal(cell, head)) ||
      head.row < 0 ||
      head.row > 15 ||
      head.col < 0 ||
      head.col > 15
    ) {
      clearInterval(interval);
    }

    snake.cells.unshift(head);

    if (equal(head, apple)) {
      score++;
      scoreDiv.innerText = score;
      apple = randomApple();
    } else snake.cells.pop();
  };

  const animate = () => {
    drawFrame();
    moveSnake();
  };

  const interval = setInterval(animate, 1000 / 10);

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (snake.direction !== Direction.South)
          snake.direction = Direction.North;
        break;
      case "ArrowDown":
        if (snake.direction !== Direction.North)
          snake.direction = Direction.South;
        break;
      case "ArrowRight":
        if (snake.direction !== Direction.West)
          snake.direction = Direction.East;
        break;
      case "ArrowLeft":
        if (snake.direction !== Direction.East)
          snake.direction = Direction.West;
        break;
    }
  });
});
