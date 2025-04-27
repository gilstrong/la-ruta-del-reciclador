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
    .bindPopup('¡Aquí tengo material para reciclar!')
    .openPopup();

  marcadores.push(marcador); // Guardar el marcador en la lista

  // Evento para eliminar marcador individualmente
  marcador.on('contextmenu', function() {
    if (confirm('¿Seguro que quieres eliminar este punto de reciclaje?')) {
      map.removeLayer(marcador);
      const index = marcadores.indexOf(marcador);
      if (index > -1) {
        marcadores.splice(index, 1);
      }
    }
  });
}

// Evento para agregar marcador manual haciendo click en el mapa
map.on('click', function(e) {
  const { lat, lng } = e.latlng;
  crearMarcador(lat, lng);
});

// Botón para agregar la ubicación actual del usuario
document.getElementById('btnUbicacion').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      crearMarcador(lat, lng);
      map.setView([lat, lng], 17);
    }, function() {
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
    });
    marcadores.length = 0; // Vaciar la lista
  }
});
