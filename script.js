const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

document.body.style.margin = 0;
document.body.style.overflow = "hidden";
canvas.style.display = "block";
canvas.style.backgroundColor = "black"; 
let stars = [];
let score = 0;
let gameRunning = false;
let targetColor;

const bgMusic = new Audio("assets/audio/background.mp3");
bgMusic.loop = true;

const catchSound = new Audio("assets/audio/catch.mp3");
const wrongCatchSound = new Audio("assets/audio/wrongCatch.mp3"); // New sound for wrong color catch


class Star {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.color = color;
    this.speed = Math.random() * 2 + 1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.y += this.speed;
  }
}


function createStar() {
  const x = Math.random() * canvas.width;
  const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  stars.push(new Star(x, 0, color));
}

const player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  size: 30,
  color: "white",
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  },
};


let keys = {};
let mouseX = player.x; 
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));


canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
});


function updatePlayer() {
  if (keys["ArrowLeft"] && player.x > player.size) {
    player.x -= 5;
  }
  if (keys["ArrowRight"] && player.x < canvas.width - player.size) {
    player.x += 5;
  }
  
  player.x = mouseX;

  if (player.x < player.size) {
    player.x = player.size;
  }
  if (player.x > canvas.width - player.size) {
    player.x = canvas.width - player.size;
  }
}

function checkCollision(star) {
  const dx = player.x - star.x;
  const dy = player.y - star.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < player.size + star.size;
}


function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

 
  player.draw();

  
  stars.forEach((star, index) => {
    star.update();
    star.draw();

   
    if (checkCollision(star)) {
      if (star.color === targetColor) {
        score++;
        catchSound.currentTime = 0;
        catchSound.play(); 
      } else {
        score--;
        wrongCatchSound.currentTime = 0;
        wrongCatchSound.play(); // Play wrong color sound
      }
      stars.splice(index, 1);
    }

   
    if (star.y > canvas.height) {
      stars.splice(index, 1);
    }
  });

 
  updatePlayer();

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);


  ctx.fillStyle = targetColor;
  ctx.fillRect(canvas.width - 150, 10, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Target:", canvas.width - 220, 30);

  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  stars = [];
  targetColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
  gameRunning = true;
  bgMusic.play();
  gameLoop();
  setInterval(createStar, 500);
}


function stopGame() {
  gameRunning = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;
}


const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.style.position = "absolute";
startButton.style.top = "50%";
startButton.style.left = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";
startButton.style.cursor = "pointer";
startButton.style.borderRadius = "10px";
startButton.style.background = "linear-gradient(to right, #6a11cb, #2575fc)";
startButton.style.color = "white";
startButton.style.border = "none";
document.body.appendChild(startButton);

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  startGame();
});
