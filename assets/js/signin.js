const $formLogin = document.getElementById("login");

async function logar() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  abrirModal("carregamento");

  const usuarioExistente = await api.get(
    `usuarios?usuario=${usuario}&senha=${senha}`
  );

  fecharModal();

  if (usuarioExistente) {
    if (usuarioExistente[0].banido) {
      notyf.error({
        message: "Sua conta foi banida do Phishing Detector.",
        dismissible: false,
        duration: 10000,
      });
      return;
    }

    sessionStorage.setItem("usuario", JSON.stringify(usuarioExistente[0]));
    window.location.href =
      sessionStorage.getItem("login-redirect") || "index.html";
  } else {
    notyf.error({
      message: "Usuário ou senha incorreto(s).",
      dismissible: false,
      duration: 10000,
    });
  }
}

$formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  logar();
});
