
const grid = document.getElementById("grid");
const promoDiv = document.getElementById("promo");

let codes = { available: [], used: [] };

const imageMap = {
  2: "assets/b10-z199.jpg",
  4: "assets/b10-z200.jpg",
  8: "assets/b10-z201.jpg",
  16: "assets/b10-z202.jpg",
  32: "assets/b10-z203.jpg",
  64: "assets/b10-z204.jpg",
  128: "assets/b10-z205.jpg",
  256: "assets/b10-z206.jpg",
  512: "assets/b10-z207.jpg",
  1024: "assets/b10-z208.jpg",
  2048: "assets/b10-z209.jpg"
};

let board = [];

function createBoard() {
  board = [];
  grid.innerHTML = "";
  for (let i = 0; i < 16; i++) {
    const div = document.createElement("div");
    div.className = "tile";
    board.push({ el: div, value: 0 });
    grid.appendChild(div);
  }
  addRandomTile();
  addRandomTile();
  draw();
}

function draw() {
  for (let i = 0; i < 16; i++) {
    const tile = board[i];
    const val = tile.value;
    tile.el.style.backgroundImage = val ? `url('${imageMap[val]}')` : "none";
  }
}

function addRandomTile() {
  const empty = board.filter(t => t.value === 0);
  if (empty.length === 0) return;
  const rand = empty[Math.floor(Math.random() * empty.length)];
  rand.value = Math.random() < 0.9 ? 2 : 4;
}

function slide(row) {
  row = row.filter(val => val);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      if (row[i] === 2048) win();
      row[i + 1] = 0;
    }
  }
  return row.filter(val => val);
}

function move(dir) {
  let moved = false;
  for (let i = 0; i < 4; i++) {
    let line = [];
    for (let j = 0; j < 4; j++) {
      let idx = dir === "left" ? i * 4 + j :
                dir === "right" ? i * 4 + (3 - j) :
                dir === "up" ? j * 4 + i :
                dir === "down" ? (3 - j) * 4 + i : 0;
      line.push(board[idx].value);
    }

    let newLine = slide(line);
    while (newLine.length < 4) newLine.push(0);
    if (dir === "right" || dir === "down") newLine.reverse();

    for (let j = 0; j < 4; j++) {
      let idx = dir === "left" ? i * 4 + j :
                dir === "right" ? i * 4 + (3 - j) :
                dir === "up" ? j * 4 + i :
                dir === "down" ? (3 - j) * 4 + i : 0;
      if (board[idx].value !== newLine[j]) {
        board[idx].value = newLine[j];
        moved = true;
      }
    }
  }
  if (moved) {
    addRandomTile();
    draw();
  }
}

function win() {
  if (codes.available.length > 0) {
    const promo = codes.available.shift();
    codes.used.push(promo);
    promoDiv.textContent = "🎉 Победа! Ваш промокод: " + promo;
    promoDiv.classList.remove("hidden");
  } else {
    promoDiv.textContent = "Все промокоды использованы!";
    promoDiv.classList.remove("hidden");
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") move("left");
  if (e.key === "ArrowRight") move("right");
  if (e.key === "ArrowUp") move("up");
  if (e.key === "ArrowDown") move("down");
});

document.getElementById("uploadCodes").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    codes = JSON.parse(reader.result);
    alert("Коды загружены!");
  };
  reader.readAsText(file);
});

createBoard();
