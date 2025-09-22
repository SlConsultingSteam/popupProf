let isSubmitting = false;

async function handleLogin(event) {
  event.preventDefault();
  if (isSubmitting) return;

  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const errorMsg = document.getElementById("error-msg");
  const buttonText = document.getElementById("button-text");
  const button = document.getElementById("login-button");

  isSubmitting = true;
  buttonText.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Iniciando sesión...`;
  button.disabled = true;
  errorMsg.textContent = "";

  try {
    const response = await fetch('https://api-postgre-ee5da0d4a499.herokuapp.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass })
    });

    if (response.ok) {
      const data = await response.json();
      // Guarda todos los datos relevantes en sessionStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("usuario", data.usuario);
      sessionStorage.setItem("id_usuario", data.id_usuario || data.ID); // por compatibilidad
      sessionStorage.setItem("rol", data.rol);
      sessionStorage.setItem("expira_iso", data.expiraISO);

      const rol = (data.rol || '').toString().toUpperCase();
      let destino = '';
      if (rol === 'RECLUTADORA') destino = 'reclutador.html';
      else if (rol === 'PROFESIONAL') destino = 'index.html';

      if (!destino) {
        // Rol no autorizado: advertencia y vuelta a login
        Swal.fire({
          icon: 'warning',
          title: 'Acceso denegado',
          text: 'Usuario inválido o sin permisos para acceder.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          sessionStorage.clear();
          buttonText.textContent = "Ingresar";
          button.disabled = false;
          isSubmitting = false;
        });
        return;
      }

      // Mensaje de acceso unificado (reemplaza el antiguo de bienvenida)
      Swal.fire({
        icon: 'success',
        title: 'Acceso concedido',
        html: `<div style="font-size:14px;">Bienvenido(a) <b>${data.usuario}</b><br>Rol: <b>${rol}</b><br>Redirigiendo...</div>`,
        timer: 1800,
        showConfirmButton: false
      }).then(() => {
        window.location.href = destino;
      });
    } else {
      const errorText = await response.text();
      errorMsg.textContent = errorText || "Usuario o contraseña incorrectos";
      buttonText.textContent = "Ingresar";
      button.disabled = false;
      isSubmitting = false;
    }
  } catch (error) {
    errorMsg.textContent = "Error de conexión con el servidor";
    buttonText.textContent = "Ingresar";
    button.disabled = false;
    isSubmitting = false;
  }
}

function handleRecoverClick() {
  Swal.fire({
    icon: 'info',
    title: 'Recuperación',
    text: 'Funcionalidad de recuperación en construcción.',
    timer: 2000,
    showConfirmButton: false
  });
}