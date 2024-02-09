// Selecciona el canvas
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Variables del juego
var birdX = 50;
var birdY = canvas.height / 2;
var gravity = 0.4;
var velocity = 0;
var jumpStrength = -8;
var pipeWidth = 80;
const gapHeight = 150; // Espacio constante entre las tuberías
var pipes = [];
var gameOver = false;
var score = 0;
var maxScore = 0
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
var jumpSound = document.getElementById("jumpSound");
var scoresound = document.getElementById("passSound");
var crashSound = document.getElementById("crashSound");
var flappyImage = new Image();
flappyImage.src = "flappy.png";
function jump() {
  if (!gameOver) {
    velocity = jumpStrength;
    jumpSound.currentTime = 0;
    jumpSound.play();
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
document.addEventListener("touchstart", function(event) {
  // Evita el comportamiento predeterminado de la pantalla táctil
  event.preventDefault();
  jump();
});

// Manejador de eventos para saltar al hacer clic en la pantalla
document.addEventListener("click", function (event) {
  jump();
});

var rotation = 0;

// Función para dibujar el pájaro
function drawBird() {
  // Guardar la configuración de transformación actual
  ctx.save();

  // Establecer el punto de origen de la rotación en la posición del pájaro
  ctx.translate(birdX, birdY);

  // Rotar la imagen del pájaro según la dirección del movimiento
  if (velocity < 0) {
    // Si el pájaro está subiendo
    rotation = -Math.PI / 6; // Rotar hacia arriba
  } else {
    // Si el pájaro está cayendo
    rotation = Math.PI / 4; // Rotar hacia abajo
  }

  // Aplicar la rotación al contexto de dibujo
  ctx.rotate(rotation);

  // Dibujar la imagen del pájaro
  var birdWidth = 50; // Ancho deseado
  var birdHeight = 40; // Alto deseado
  ctx.drawImage(
    flappyImage,
    -birdWidth / 2,
    -birdHeight / 2,
    birdWidth,
    birdHeight
  );

  // Restaurar la configuración de transformación
  ctx.restore();
}

// Función para actualizar la posición del pájaro y las tuberías
function update() {
  if (!gameOver) {
    velocity += gravity;
    birdY += velocity;

    // Eliminar tubos fuera del canvas
    for (var i = 0; i < pipes.length; i++) {
      pipes[i].x -= 2;
      if (pipes[i].x < -pipeWidth * 2) {
        pipes.splice(i, 1); // Eliminar el tubo fuera de la pantalla
        i--; // Ajustar el índice después de eliminar el tubo
      }
    }

    if (birdY > canvas.height || birdY < 0) {
      endGame();
      crashSound.currentTime = 0;
      crashSound.play();
    }

    pipes.forEach(function (pipe) {
      pipe.x -= 2;

      if (birdX + 10 > pipe.x && birdX - 10 < pipe.x + pipeWidth) {
        if (birdY - 10 < pipe.gapY || birdY + 10 > pipe.gapY + gapHeight) {
          crashSound.currentTime = 0;
          crashSound.play();
          if (score > maxScore) {
          maxScore = 0
          maxScore += score
          }
          endGame(); // Llamada a endGame() después de reproducir el sonido del choque
        }
      }

      if (birdX > pipe.x + pipeWidth && !pipe.passed) {
        score++;
        pipe.passed = true;
        scoresound.currentTime = 0;
        scoresound.play();
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

  // Configura el color del texto normal
  ctx.fillStyle = "white";
  // Configura el color del borde del texto
  ctx.strokeStyle = "black";
  // Configura el grosor del borde del texto
  ctx.lineWidth = 6;

  // Dibuja el texto "Score" con borde
  ctx.strokeText("Score: " + score, 10, 30);
  // Dibuja el texto "Score" normal
  ctx.fillText("Score: " + score, 10, 30);

  if (gameOver) {
    // Configura el color del texto normal para "Game Over"
    ctx.fillStyle = "white";
    // Configura el color del borde del texto para "Game Over"
    ctx.strokeStyle = "black";
    // Configura el tamaño del borde del texto para "Game Over"
    ctx.lineWidth = 6;
    // Configura la fuente para "Game Over"
    ctx.font = "20px 'Press Start 2P', cursive";

    // Dibuja el texto "Game Over" con borde
    ctx.strokeText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
    ctx.strokeText("Game Over", canvas.width / 2 - 110, canvas.height / 2);
    // Dibuja el texto "Game Over" normal
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);

    // Configura el color del texto normal para "touch to restart"
    ctx.fillStyle = "white";
    // Configura el color del borde del texto para "touch to restart"
    ctx.strokeStyle = "black";
    // Configura el tamaño del borde del texto para "touch to restart"
    ctx.lineWidth = 6;
    // Dibuja el texto "touch to restart" con borde


    ctx.strokeText(
      "touch  to restart",
      canvas.width / 2 - 180,
      canvas.height / 2 + 50
    );
    // Dibuja el texto "touch to restart" normal
    ctx.fillText(
      "touch  to restart",
      canvas.width / 2 - 180,
      canvas.height / 2 + 50
    );

    ctx.strokeText(
      "touch  to restart",
      canvas.width / 2 - 170,
      canvas.height / 2 + 50
    );
    // Dibuja el texto "touch to restart" normal
    ctx.fillText(
      "touch  to restart",
      canvas.width / 2 - 180,
      canvas.height / 2 + 50
    );


   // Dibuja el texto "Score" con borde
ctx.strokeText("Score: " + score, 10, 30);
// Dibuja el texto "Score" normal
ctx.fillText("Score: " + score, 10, 30);

// Dibuja el texto "Max Score" con borde
ctx.strokeText("Max Score: " + maxScore, 10, 60);
// Dibuja el texto "Max Score" normal
ctx.fillText("Max Score: " + maxScore, 10, 60);



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
