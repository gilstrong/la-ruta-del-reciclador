const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/rutaReciclador', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

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

// Función para sumar puntos al usuario
async function sumarPunto(nombre) {
  try {
    const response = await fetch('http://localhost:3000/sumar-punto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });

    const data = await response.json();
    console.log(data);  // Imprime el mensaje de éxito
  } catch (error) {
    console.error('Error al sumar el punto:', error);  // Muestra cualquier error
  }
}

// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});



app.get('/perfil/:nombre', async (req, res) => {
  const { nombre } = req.params;

  let usuario = await Usuario.findOne({ nombre });

  if (!usuario) {
    // Si no existe el usuario, lo creamos con 0 puntos
    usuario = await Usuario.create({ nombre, puntos: 0 });
  }

  res.json(usuario);
});
