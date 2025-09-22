function checkAuth() {
  const token = sessionStorage.getItem("token");
  const exp = sessionStorage.getItem("expira_iso");
  const rol = sessionStorage.getItem("rol");
  const path = (location.pathname || '').toLowerCase();
  const page = path.split('/').pop();
  const role = (rol || '').toString().toUpperCase();

  // Enforce role by page: index.html -> PROFESIONAL, reclutador.html -> RECLUTADORA
  const allowed = (page === 'index.html' && role === 'PROFESIONAL') ||
                  (page === 'reclutador.html' && role === 'RECLUTADORA');
  if (!role || !allowed) {
    // Mostrar advertencia amigable antes de redirigir
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: 'Usuario inválido o sin permisos para acceder a esta sección.',
        confirmButtonText: 'Ir al inicio de sesión'
      }).then(() => {
        sessionStorage.clear();
        window.location.href = "login.html";
      });
    } else {
      alert('Usuario inválido o sin permisos para acceder a esta sección.');
      sessionStorage.clear();
      window.location.href = "login.html";
    }
    return;
  }
  if (!token || (exp && new Date(exp) < new Date())) {
    sessionStorage.clear();
    window.location.href = "login.html";
  }
}
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
checkAuth();