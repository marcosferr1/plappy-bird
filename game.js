// Selecciona el canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Variables del juego
var birdX = 50;
var birdY = canvas.height / 2;
var gravity = 0.5;
var velocity = 0;
var jumpStrength = -8;
var pipeWidth = 80;
const gapHeight = 150; // Espacio constante entre las tuberías
var pipes = [];
var gameOver = false;
var score = 0;
function generatePipe() {
  // Si ya hay tuberías en la matriz pipes, calculamos la posición x de la nueva tubería
  var x = canvas.width;
  if (pipes.length > 0) {
      // La posición x será la posición x de la última tubería más el ancho de la tubería más un espacio constante
      x = pipes[pipes.length - 1].x + pipeWidth + 200; // 200 es el espacio constante entre tuberías
  }

  var minY = 50; // Altura mínima para la parte superior de la tubería
  var maxY = canvas.height - gapHeight - 50; // Altura máxima para la parte inferior de la tubería
  var gapY = Math.floor(Math.random() * (maxY - minY + 1)) + minY; // Genera una altura aleatoria dentro del rango

  pipes.push({
      x: x,
      gapY: gapY,
  });
}

function drawPipes() {
  ctx.fillStyle = "green"; // Color de las tuberías
  ctx.strokeStyle = "black"; // Color del borde de las tuberías
  ctx.lineWidth = 2; // Grosor del borde de las tuberías

  pipes.forEach(function (pipe) {
      // Dibuja el tubo superior
      ctx.fillRect(pipe.x, 0, pipeWidth, pipe.gapY);
      ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.gapY);

      // Dibuja el tubo inferior
      ctx.fillRect(
          pipe.x,
          pipe.gapY + gapHeight, // Ajusta la posición vertical para el tubo inferior
          pipeWidth,
          canvas.height - (pipe.gapY + gapHeight)
      );
      ctx.strokeRect(
          pipe.x,
          pipe.gapY + gapHeight, // Ajusta la posición vertical para el tubo inferior
          pipeWidth,
          canvas.height - (pipe.gapY + gapHeight)
      );
  });
}

// Manejador de eventos para saltar
function jump() {
  if (!gameOver) {
    velocity = jumpStrength;
  } else {
    reset();
  }
}

// Manejador de eventos para saltar al presionar la tecla de espacio
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    jump();
  }
});
canvas.addEventListener("touchstart", function () {
  jump();
});

// Manejador de eventos para saltar al hacer clic en la pantalla
canvas.addEventListener("click", function () {
  jump();
});

// Función para dibujar el pájaro
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(birdX, birdY, 10, 0, Math.PI * 2);
  ctx.fill();
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
    ctx.font = "48px arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    ctx.fillText(
      "touch  to restart",
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
