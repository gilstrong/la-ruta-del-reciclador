document.addEventListener('DOMContentLoaded', async () => {
  // Obtener el nombre desde localStorage
  const nombre = localStorage.getItem('usuario');

  if (!nombre) {
    alert('Usuario no encontrado. Por favor inicia sesión.');
    window.location.href = '/login'; // Redirige si no hay usuario
    return;
  }

  try {
    // Llama a la API con el nombre almacenado
    const respuesta = await fetch(`/api/perfil/${nombre.toLowerCase()}`);
    const datos = await respuesta.json();

    if (datos.error) {
      alert('No se pudo cargar el perfil: ' + datos.error);
      return;
    }

    // Actualiza el DOM con los datos del usuario
    document.getElementById('nombreUsuario').textContent = datos.nombre;
    document.getElementById('puntosUsuario').textContent = datos.puntos;

  } catch (error) {
    console.error('Error al cargar perfil:', error);
    alert('Error al conectar con el servidor.');
  }
});
