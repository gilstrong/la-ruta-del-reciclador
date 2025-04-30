// Obtener el nombre del usuario desde la URL
const urlParams = new URLSearchParams(window.location.search);
const nombreUsuario = urlParams.get('nombre');

// Mostrar el nombre del usuario
document.getElementById('nombreUsuario').textContent = nombreUsuario;

// Función para cargar el perfil del usuario desde el servidor
async function cargarPerfil() {
  try {
    const response = await fetch(`/perfil/${nombreUsuario}`);
    const usuario = await response.json();

    // Mostrar los puntos del usuario
    document.getElementById('puntosUsuario').textContent = usuario.puntos;
  } catch (error) {
    console.error('Error al cargar el perfil:', error);
  }
}

// Función para sumar un punto
async function sumarPunto() {
  try {
    const response = await fetch('http://localhost:3000/sumar-punto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: nombreUsuario }),
    });

    const data = await response.json();
    if (response.ok) {
      alert('¡Punto sumado!');
      cargarPerfil(); // Recargar los puntos del usuario
    } else {
      alert('Error al sumar el punto');
    }
  } catch (error) {
    console.error('Error al sumar el punto:', error);
  }
}

// Llamamos a la función para cargar el perfil cuando se carga la página
window.onload = cargarPerfil;

// Evento para sumar puntos cuando el usuario hace clic en el botón
document.getElementById('sumarPunto').addEventListener('click', sumarPunto);
