// Selecciona el canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Variables del juego
var birdX = 50;
var birdY = canvas.height / 2;
var gravity = 0.5;
var velocity = 0;
var jumpStrength = -8;
var pipeWidth = 80 ;
const gapHeight = 150; // Espacio constante entre las tuberías
var pipes = [];
var gameOver = false;
var score = 0;

function generatePipe() {
    var minY = 50; // Altura mínima para la parte superior de la tubería
    var maxY = canvas.height - gapHeight - 50; // Altura máxima para la parte inferior de la tubería
    var gapY = Math.floor(Math.random() * (maxY - minY + 1)) + minY; // Genera una altura aleatoria dentro del rango

    pipes.push({
        x: canvas.width,
        gapY: gapY
    });
}

// Manejador de eventos para saltar
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    if (!gameOver) {
      velocity = jumpStrength;
    } else {
      reset();
    }
  }
});

// Función para dibujar el pájaro
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(birdX, birdY, 10, 0, Math.PI * 2);
  ctx.fill();
}

// Función para dibujar las tuberías
function drawPipes() {
    ctx.fillStyle = "green"; // Color de las tuberías
    ctx.strokeStyle = "black"; // Color del borde de las tuberías
    ctx.lineWidth = 2; // Grosor del borde de las tuberías

    pipes.forEach(function (pipe) {
        // Dibuja el tubo superior
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
        ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.gapY);

        // Dibuja el tubo inferior
        ctx.fillRect(pipe.x, pipe.gapY + gapHeight, pipeWidth, canvas.height - (pipe.gapY + gapHeight));
        ctx.strokeRect(pipe.x, pipe.gapY + gapHeight, pipeWidth, canvas.height - (pipe.gapY + gapHeight));
    });
}

// Función para actualizar la posición del pájaro y las tuberías
function update() {
  if (!gameOver) {
    velocity += gravity;
    birdY += velocity;

    if (birdY > canvas.height || birdY < 0) {
      endGame();
    }

    pipes.forEach(function (pipe) {
      pipe.x -= 2;

      if (birdX + 10 > pipe.x && birdX - 10 < pipe.x + pipeWidth) {
        if (birdY - 10 < pipe.gapY || birdY + 10 > pipe.gapY + gapHeight) {
          endGame();
        }
      }

      if (birdX > pipe.x + pipeWidth && !pipe.passed) {
        score++;
        pipe.passed = true;
      }
    });

    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
      pipes.shift();
    }

    if (pipes.length < 2) {
      generatePipe();
    }
  }

  draw();
  requestAnimationFrame(update);
}

// Función para dibujar el juego
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";

  ctx.fillText("Score: " + score, 10, 30);
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText(
      "Press Space to restart",
      canvas.width / 2 - 180,
      canvas.height / 2 + 50
    );
  }
}

// Función para terminar el juego
function endGame() {
  gameOver = true;
}

// Función para reiniciar el juego
function reset() {
  birdY = canvas.height / 2;
  velocity = 0;
  pipes = [];
  gameOver = false;
  score = 0;
  // Generar la primera tubería despué s del reinicio
}

generatePipe();
update();
