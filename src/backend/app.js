const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use('/styles', express.static(path.join(__dirname, '..', 'styles'))); // src/styles sí está dentro
app.use('/scripts', express.static(path.join(__dirname, '..', '..', 'public', 'scripts'))); // salir dos veces para llegar a public

// Páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'mapa.html'));
});

// Opcionalmente también servir /index.html y /mapa.html
app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/mapa.html', (req, res) => {
  res.redirect('/mapa');
});


// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
