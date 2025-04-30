const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/rutaReciclador', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Servir archivos estáticos
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, '..', '..', 'public', 'scripts')));

// Rutas de páginas
// Rutas de páginas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'mapa.html'));
});

// Ruta para la página de registro
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'registro.html'));
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/mapa.html', (req, res) => {
  res.redirect('/mapa');
});

app.get('/registro.html', (req, res) => {
  res.redirect('/registro');
});

// Ruta para registrar al usuario
app.post('/api/registrar-usuario', async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ nombre });

    if (usuario) {
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    // Crear un nuevo usuario con 0 puntos
    usuario = new Usuario({ nombre, puntos: 0 });
    await usuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Ruta para sumar punto
app.post('/sumar-punto', async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'Se requiere el nombre del usuario' });
  }

  try {
    let usuario = await Usuario.findOne({ nombre });

    if (!usuario) {
      usuario = new Usuario({ nombre, puntos: 1 });
    } else {
      usuario.puntos += 1;
    }

    await usuario.save();
    res.json({ mensaje: 'Punto sumado con éxito', usuario });
  } catch (error) {
    console.error('Error al guardar el punto:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Ruta para ver perfil
app.get('/perfil/:nombre', async (req, res) => {
  const { nombre } = req.params;

  try {
    let usuario = await Usuario.findOne({ nombre });

    if (!usuario) {
      usuario = await Usuario.create({ nombre, puntos: 0 });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
