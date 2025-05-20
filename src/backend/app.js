require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const Usuario = require('./models/Usuario');

const app = express();

// Middleware CORS
// Asegúrate de definir FRONTEND_URL en tu .env (e.g. https://tusitio.netlify.app)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware para parsear JSON\app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB Atlas:', err));

// Servir archivos estáticos
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/scripts', express.static(path.join(__dirname, '..', '..', 'public', 'scripts')));
app.use('/model', express.static(path.join(__dirname, '..', '..', 'public', 'model')));

// Rutas de páginas estáticas
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'index.html')));
app.get('/mapa', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'mapa.html')));
app.get('/registro', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'registro.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'login.html')));
app.get('/perfil', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'perfil.html')));
app.get('/residuos', (req, res) => res.sendFile(path.join(__dirname, '..', 'pages', 'residuos.html')));

// Redirecciones amigables (.html)
['index', 'mapa', 'registro', 'login', 'perfil', 'residuos'].forEach(page => {
  app.get(`/${page}.html`, (req, res) => res.redirect(`/${page}`));
});

// API: registrar usuario
app.post('/api/registrar-usuario', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  try {
    const nombreNormalizado = nombre.toLowerCase();
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (usuario) {
      return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
    }

    usuario = new Usuario({ nombre: nombreNormalizado, puntos: 0 });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// API: sumar punto
app.post('/api/sumar-punto', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Se requiere el nombre del usuario' });

  try {
    const nombreNormalizado = nombre.toLowerCase();
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

// API: perfil del usuario
app.get('/api/perfil/:nombre', async (req, res) => {
  const nombreNormalizado = req.params.nombre.toLowerCase();
  console.log('Perfil solicitado para:', nombreNormalizado);

  try {
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      usuario = new Usuario({ nombre: nombreNormalizado, puntos: 0 });
      await usuario.save();
    }

    console.log('Usuario encontrado en DB:', usuario);
    res.json({ nombre: usuario.nombre, puntos: usuario.puntos });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// API: login
app.post('/api/login', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre de usuario es obligatorio' });

  try {
    const nombreNormalizado = nombre.toLowerCase();
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no está registrado' });
    }

    // Devolver el objeto usuario completo (o los campos que necesites)
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: { _id: usuario._id, nombre: usuario.nombre, puntos: usuario.puntos }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Hubo un problema con el inicio de sesión' });
  }
});

// API: ranking de usuarios
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
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
