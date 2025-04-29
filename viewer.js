const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 800;

const directions = [
  "front", "front_right", "right", "back_right",
  "back", "back_left", "left", "front_left",
  "top", "bottom",
  "top_front", "top_right", "top_back", "top_left",
  "bottom_front", "bottom_right", "bottom_back", "bottom_left"
];

const angleMap = {
  "top": [-1, 0], "top_front": [-1, 1], "top_right": [-1, 2], "top_back": [-1, 3], "top_left": [-1, 6],
  "front": [0, 0], "front_right": [0, 1], "right": [0, 2], "back_right": [0, 3],
  "back": [0, 4], "back_left": [0, 5], "left": [0, 6], "front_left": [0, 7],
  "bottom": [1, 0], "bottom_front": [1, 1], "bottom_right": [1, 2], "bottom_back": [1, 3], "bottom_left": [1, 6]
};

const images = {};
let loaded = 0;

directions.forEach(name => {
  const img = new Image();
  img.src = `${name}.jpg`;
  img.onload = () => {
    images[name] = img;
    loaded++;
    if (loaded === directions.length) {
      drawImage(currentY, currentX);
    }
  };
});

let currentX = 0;
let currentY = 0;

function drawImage(y, x) {
  const direction = Object.entries(angleMap).find(([key, val]) => val[0] === y && val[1] === x);
  if (direction) {
    const img = images[direction[0]];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }
}

// ドラッグ＆スワイプ共通変数
let isDragging = false;
let startX = 0;
let startY = 0;

// PC：マウス操作
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  handleDrag(e.clientX, e.clientY);
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// モバイル：タッチ操作
canvas.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  handleDrag(x, y);
  startX = x;
  startY = y;
}, { passive: true });

function handleDrag(x, y) {
  const dx = x - startX;
  const dy = y - startY;

  if (Math.abs(dx) > 20) {
    currentX = (currentX + (dx > 0 ? 1 : -1) + 8) % 8;
    startX = x;
  }

  if (Math.abs(dy) > 20) {
    currentY = Math.max(-1, Math.min(1, currentY + (dy > 0 ? 1 : -1)));
    startY = y;
  }


// スクロール完全無効化
document.body.addEventListener('touchmove', function(e) {
  e.preventDefault();
}, { passive: false });

  drawImage(currentY, currentX);
}