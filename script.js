const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = Math.min(window.innerWidth * 0.9, 500);
canvas.height = canvas.width * 0.8;

const paddleWidth = canvas.width * 0.2;
const paddleHeight = 12;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 20;
let dy = -20;

let rightPressed = false;
let leftPressed = false;

let score = 0;
let lives = 3;
let timer = 0;
let interval;
let gameStarted = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
    if (!gameStarted) startGame();
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
    if (!gameStarted) startGame();
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function tekanKiri() {
  leftPressed = true;
  rightPressed = false;
  if (!gameStarted) startGame();
}
function lepasKiri() {
  leftPressed = false;
}
function tekanKanan() {
  rightPressed = true;
  leftPressed = false;
  if (!gameStarted) startGame();
}
function lepasKanan() {
  rightPressed = false;
}

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// ←
leftBtn.addEventListener("mousedown", tekanKiri);
leftBtn.addEventListener("mouseup", lepasKiri);
leftBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  tekanKiri();
});
leftBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  lepasKiri();
});

// →
rightBtn.addEventListener("mousedown", tekanKanan);
rightBtn.addEventListener("mouseup", lepasKanan);
rightBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  tekanKanan();
});
rightBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  lepasKanan();
});

function drawPaddle() {
  const gradient = ctx.createLinearGradient(paddleX, 0, paddleX + paddleWidth, 0);
  gradient.addColorStop(0, '#00f2fe');
  gradient.addColorStop(1, '#4facfe');

  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = gradient;
  ctx.shadowColor = "#000";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();

  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
  if (ballY + dy < ballRadius) {
    dy = -dy;
  } else if (ballY + dy > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
      score++;
    } else {
      lives--;
      if (lives <= 0) {
        clearInterval(interval);
        gameOver();
        return;
      } else {
        resetBall();
        return;
      }
    }
  }

  ballX += dx;
  ballY += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  updateInfo();
}

function updateInfo() {
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("timer").textContent = timer;
}

function startGame() {
  gameStarted = true;
  interval = setInterval(draw, 10);
  setInterval(() => {
    if (gameStarted) timer++;
  }, 1000);
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  dx = 20;
  dy = -20;
  paddleX = (canvas.width - paddleWidth) / 10;
}

function gameOver() {
  alert("GAME OVER");
  const name = prompt("Enter your name:", "Guest") || "Guest";

  const playerRecord = {
    name,
    score,
    timer,
  };

  let records = JSON.parse(localStorage.getItem("BounceBallRecord")) || [];
  records.push(playerRecord);

  records.sort((a, b) => {
    if (b.score === a.score) return a.timer - b.timer;
    return b.score - a.score;
  });

  records = records.slice(0, 5);
  localStorage.setItem("BounceBallRecord", JSON.stringify(records));

  showRanking(records);
  resetGame();
}

function resetGame() {
  score = 0;
  timer = 0;
  lives = 3;
  resetBall();
  updateInfo();
  gameStarted = false;
}

function showRanking(records) {
  let message = "Ranking:\n";
  records.forEach((record, index) => {
    message += `Rank ${index + 1}: ${record.name} - (Score: ${record.score}; Timer: ${record.timer}s)\n`;
  });
  setTimeout(() => alert(message), 1000);
}

draw();
