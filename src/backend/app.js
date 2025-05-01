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



// Ruta para servir perfil.html

app.get('/perfil.html', (req, res) => {
  res.redirect('/perfil');
});

// Servir la página perfil.html en /perfil
app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'pages', 'perfil.html'));
});

// Rutas de páginas
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
    // Buscar al usuario por nombre en minúsculas para evitar problemas con mayúsculas/minúsculas
    let usuario = await Usuario.findOne({ nombre: nombre.toLowerCase() });

    if (usuario) {
      // Si el usuario ya existe, reiniciar los puntos
      usuario.puntos = 0; // Reiniciar los puntos
      await usuario.save(); // Guardar los cambios
      return res.status(200).json({ mensaje: 'El usuario ya está registrado, pero los puntos han sido reiniciados' });
    }

    // Si el usuario no existe, crear uno nuevo
    usuario = new Usuario({ nombre: nombre.toLowerCase(), puntos: 0 });
    await usuario.save(); // Guardar el nuevo usuario

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
// Ruta API para ver el perfil del usuario con puntos
app.get('/api/perfil/:nombre', async (req, res) => {
  const nombreNormalizado = req.params.nombre.toLowerCase();

  try {
    let usuario = await Usuario.findOne({ nombre: nombreNormalizado });

    if (!usuario) {
      usuario = await Usuario.create({ nombre: nombreNormalizado, puntos: 0 });
    }

    res.json(usuario); // Devuelve el perfil con los puntos
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});


// Iniciar servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
