const express = require('express');
const app = express();
const path = require('path');

// Directorio que contiene los archivos del juego
const gameDirectory = path.join(__dirname, '');

// Ruta para servir los archivos estáticos del juego
app.use(express.static(gameDirectory));

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
