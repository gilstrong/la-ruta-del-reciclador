document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada

  // Obtener el nombre de usuario del campo de texto
  const nombre = document.getElementById('nombreLogin').value.trim();

  // Verificar que el nombre no esté vacío
  if (!nombre) {
    document.getElementById('mensajeErrorLogin').textContent = 'Por favor ingresa un nombre de usuario';
    return;
  }

  try {
    // Hacer la solicitud POST a la API de inicio de sesión
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre }),
    });

    const data = await response.json();

    if (response.ok) {
      // Guardar el nombre de usuario en localStorage
      localStorage.setItem('usuario', nombre.toLowerCase());

      // Si el inicio de sesión fue exitoso
      alert('Inicio de sesión exitoso');

      // Redirigir al perfil
      window.location.href = '/perfil';
    } else {
      // Si hubo un error (usuario no encontrado)
      document.getElementById('mensajeErrorLogin').textContent = data.error || 'Error desconocido';
    }
  } catch (error) {
    console.error('Error al intentar iniciar sesión:', error);
    document.getElementById('mensajeErrorLogin').textContent = 'Hubo un error, por favor intenta nuevamente';
  }
});
