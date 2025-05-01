// Guardar nombre del usuario desde la URL (si existe)
const params = new URLSearchParams(window.location.search);
const nombreDesdeUrl = params.get('nombre');
if (nombreDesdeUrl) {
  localStorage.setItem("usuario", nombreDesdeUrl);
}

// Obtener el nombre del usuario desde localStorage
const nombreUsuario = localStorage.getItem("usuario");

// Verificar que el usuario esté definido
if (!nombreUsuario) {
  alert("No se detectó un usuario válido. Por favor vuelve a iniciar sesión.");
}

// Crear el mapa centrado en Villa Juana (aproximadamente)
const map = L.map('map').setView([18.4861, -69.9312], 16);

// Cargar el mapa base de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Lista para guardar los marcadores
const marcadores = [];

// Función para crear un marcador que se puede borrar
function crearMarcador(lat, lng) {
  const marcador = L.marker([lat, lng]).addTo(map)
    .bindPopup('¡Aquí tengo material para reciclar!');

  marcadores.push(marcador); // Guardar el marcador en la lista

  // Guardar la ubicación en el servidor cuando se agrega un marcador
  guardarUbicacionEnServidor(lat, lng);

  // Sumar punto al usuario (si hay nombre válido)
  if (nombreUsuario) {
    console.log(`Sumando punto al usuario ${nombreUsuario}`);
    sumarPunto(nombreUsuario);
  }

  // Evento para eliminar marcador individualmente
  marcador.on('contextmenu', function () {
    if (confirm('¿Seguro que quieres eliminar este punto de reciclaje?')) {
      map.removeLayer(marcador);
      const index = marcadores.indexOf(marcador);
      if (index > -1) {
        marcadores.splice(index, 1);
      }
      eliminarUbicacionEnServidor(lat, lng);
    }
  });
}

// Función para guardar la ubicación en el servidor
function guardarUbicacionEnServidor(lat, lng) {
  fetch('/api/guardar-ubicacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng })
  })
    .then(res => res.json())
    .then(data => console.log('Ubicación guardada:', data))
    .catch(error => console.error('Error al guardar ubicación:', error));
}

// Función para eliminar la ubicación del servidor
function eliminarUbicacionEnServidor(lat, lng) {
  fetch('/api/eliminar-ubicacion', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng })
  })
    .then(res => res.json())
    .then(data => console.log('Ubicación eliminada:', data))
    .catch(error => console.error('Error al eliminar ubicación:', error));
}

// Cargar los puntos guardados desde el servidor
function cargarPuntosDeReciclaje() {
  fetch('/api/cargar-puntos')
    .then(res => res.json())
    .then(puntos => {
      puntos.forEach(punto => {
        crearMarcador(punto.lat, punto.lng);
      });
    })
    .catch(error => console.error('Error al cargar puntos:', error));
}

// Llamar a la función al cargar la página
window.onload = cargarPuntosDeReciclaje;

// Evento para agregar marcador manual haciendo clic en el mapa
map.on('click', function (e) {
  const { lat, lng } = e.latlng;
  crearMarcador(lat, lng);
});

// Botón para agregar la ubicación actual del usuario
document.getElementById('btnUbicacion').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      crearMarcador(lat, lng);
      map.setView([lat, lng], 17);
    }, function () {
      alert('No se pudo obtener tu ubicación.');
    });
  } else {
    alert('Tu navegador no soporta geolocalización.');
  }
});

// Botón para borrar TODOS los marcadores
document.getElementById('btnBorrarTodo').addEventListener('click', () => {
  if (confirm('¿Seguro que quieres eliminar TODOS los puntos de reciclaje?')) {
    marcadores.forEach(marcador => {
      map.removeLayer(marcador);
      const { lat, lng } = marcador.getLatLng();
      eliminarUbicacionEnServidor(lat, lng);
    });
    marcadores.length = 0;
  }
});

// Función para sumar puntos al usuario
async function sumarPunto(nombre) {
  try {
    const response = await fetch('http://localhost:3000/sumar-punto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Punto sumado:', data);
      alert(`¡Punto sumado! Ahora tienes ${data.usuario.puntos} puntos.`);
    } else {
      console.error('Error al sumar punto:', data.error);
    }
  } catch (error) {
    console.error('Error al sumar el punto:', error);
  }
}
