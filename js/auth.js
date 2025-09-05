function checkAuth() {
  const token = sessionStorage.getItem("token");
  const exp = sessionStorage.getItem("expira_iso");
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