const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let dx = 2;
let dy = -2;

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

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#f00";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();

  if(ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
  if(ballY + dy < ballRadius) {
    dy = -dy;
  } else if(ballY + dy > canvas.height - ballRadius) {
    if(ballX > paddleX && ballX < paddleX + paddleWidth) {
      dy = -dy;
      score++;
    } else {
      lives--;
      if(lives <= 0) {
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

  if(rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if(leftPressed && paddleX > 0) {
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
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
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