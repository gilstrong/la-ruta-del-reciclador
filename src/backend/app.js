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
app.use('/model', express.static(path.join(__dirname, '..', '..', 'public', 'model')));



// Redirección amigable para perfil
app.get('/perfil.html', (req, res) => {
  res.redirect('/perfil');
});
app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'perfil.html'));
});

// Redirección amigable para residuos
app.get('/residuos', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'residuos.html'));
});
app.get('/residuos.html', (req, res) => {
  res.redirect('/residuos');
});

// Rutas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});
app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'mapa.html'));
});
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'registro.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'login.html'));
});

// Redirecciones con .html
app.get('/index.html', (req, res) => res.redirect('/'));
app.get('/mapa.html', (req, res) => res.redirect('/mapa'));
app.get('/registro.html', (req, res) => res.redirect('/registro'));
app.get('/login.html', (req, res) => res.redirect('/login'));

// Ruta para registrar al usuario
app.post('/api/registrar-usuario', async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  try {
    const nombreNormalizado = nombre.toLowerCase();
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (usuario) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    usuario = new Usuario({ nombre: nombreNormalizado, puntos: 0 });
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
  if (!nombre) return res.status(400).json({ error: 'Se requiere el nombre del usuario' });

  const nombreNormalizado = nombre.toLowerCase();

  try {
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      usuario = new Usuario({ nombre: nombreNormalizado, puntos: 1 });
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

// Ruta para ver el perfil del usuario con puntos
app.get('/api/perfil/:nombre', async (req, res) => {
  const nombreNormalizado = req.params.nombre.toLowerCase();

  try {
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      usuario = new Usuario({ nombre: nombreNormalizado, puntos: 0 });
      await usuario.save();
    }

    res.json({
      nombre: usuario.nombre,
      puntos: usuario.puntos
    });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Ruta para el login
app.post('/api/login', async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre de usuario es obligatorio' });
  }

  const nombreNormalizado = nombre.toLowerCase();

  try {
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no está registrado' });
    }

    res.status(200).json({ mensaje: 'Usuario encontrado, inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un problema con el inicio de sesión' });
  }
});

// Ruta para obtener el ranking de usuarios por puntos
app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await Usuario.find().sort({ puntos: -1 }).limit(10);
    res.json(ranking);
  } catch (error) {
    console.error('Error al obtener el ranking:', error);
    res.status(500).json({ error: 'Error al obtener el ranking' });
  }
});

// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
