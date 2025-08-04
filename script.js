const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 10;
const GRID_WIDTH = 80;
const GRID_HEIGHT = 60;

canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;

let grid = createGrid();
let running = false;
let interval;

function createGrid(fill = false) {
  return Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => (fill ? Math.round(Math.random()) : 0))
  );
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function getNextGeneration(current) {
  const next = createGrid();
  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      const neighbors = countNeighbors(current, x, y);
      const alive = current[y][x];
      next[y][x] = (alive && (neighbors === 2 || neighbors === 3)) || (!alive && neighbors === 3) ? 1 : 0;
    }
  }
  return next;
}

function countNeighbors(grid, x, y) {
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < GRID_WIDTH && ny < GRID_HEIGHT) {
        count += grid[ny][nx];
      }
    }
  }
  return count;
}

function update() {
  grid = getNextGeneration(grid);
  drawGrid();
}

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
  grid[y][x] = grid[y][x] ? 0 : 1;
  drawGrid();
});

document.getElementById('start').onclick = () => {
  if (!running) {
    interval = setInterval(update, 100);
    running = true;
  }
};

document.getElementById('stop').onclick = () => {
  clearInterval(interval);
  running = false;
};

document.getElementById('clear').onclick = () => {
  grid = createGrid(false);
  drawGrid();
};

document.getElementById('random').onclick = () => {
  grid = createGrid(true);
  drawGrid();
};

// Initial render
drawGrid();
