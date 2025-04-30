document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
  
    if (!nombre) {
      alert('Por favor ingresa un nombre.');
      return;
    }
  
    // Enviar el nombre al servidor para crear el usuario
    try {
      const response = await fetch('/api/registrar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Redirigir al mapa después del registro
        window.location.href = `/mapa.html?nombre=${nombre}`;
      } else {
        alert('Hubo un error al registrar el usuario. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Hubo un error al registrar el usuario. Intenta nuevamente.');
    }
  });
  