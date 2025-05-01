document.addEventListener('DOMContentLoaded', async () => {
  const nombre = localStorage.getItem('usuario');

  if (!nombre) {
    alert('Usuario no encontrado. Por favor inicia sesión.');
    window.location.href = '/login'; // Redirige si no hay usuario
    return;
  }

  try {
    const respuesta = await fetch(`/api/perfil/${nombre}`);
    const datos = await respuesta.json();

    if (datos.error) {
      alert('No se pudo cargar el perfil: ' + datos.error);
      return;
    }

    document.getElementById('nombreUsuario').textContent = datos.nombre;
    document.getElementById('puntosUsuario').textContent = datos.puntos;

  } catch (error) {
    console.error('Error al cargar perfil:', error);
    alert('Error al conectar con el servidor.');
  }
});
