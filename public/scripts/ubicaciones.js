function guardarUbicacion(usuarioId, latitud, longitud, puntos) {
    fetch('/ubicaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuarioId, latitud, longitud, puntos })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Ubicación guardada:', data);
      // Mostrar mensaje de éxito al usuario
    })
    .catch(error => {
      console.error('Error al guardar la ubicación:', error);
      // Mostrar mensaje de error al usuario
    });
  }
  
  // Ejemplo de uso (asumiendo que tienes estas variables disponibles):
  const usuarioId = localStorage.getItem('usuarioId'); // Obtener el usuarioId del localStorage
  const latitud = 40.7128; // Obtener la latitud del mapa
  const longitud = -74.0060; // Obtener la longitud del mapa
  const puntos = 10; // Obtener los puntos del usuario
  
  guardarUbicacion(usuarioId, latitud, longitud, puntos);