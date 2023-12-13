async function carregarDadosRender() {
  const url = new URL(window.location.href);

  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuario"));
  let paginaUsuario = false;
  let usuarioAdmin = false;
  let somenteUsuario = false;
  let somenteEmpresa = false;
  let usuarioVerificado = false;

  if (usuarioLogado) {
    paginaUsuario = url.searchParams.get("id") == usuarioLogado.id;
    usuarioAdmin = usuarioLogado.admin;
  }

  if (url.pathname == "/usuario.html") {
    const usuario = await api.get("usuarios/" + url.searchParams.get("id"));

    if (usuario) {
      somenteUsuario = !usuario.empresa;
      somenteEmpresa = usuario.empresa;
      usuarioVerificado = usuario.verificado;
    }
  }

  return {
    "is-user-unlogged": usuarioLogado == null,
    "is-user-logged": usuarioLogado != null,
    "is-current-user-page": paginaUsuario,
    "is-user-admin": usuarioAdmin,
    "is-user-page": somenteUsuario,
    "is-company-page": somenteEmpresa,
    "is-verified-user-page": usuarioVerificado,
  };
}

async function definirVisibilidade() {
  const DADOS_RENDER = await carregarDadosRender();
  const componentesCondicionais = document.querySelectorAll("[data-visible]");

  componentesCondicionais.forEach((comp) => {
    if (!DADOS_RENDER[comp.dataset.visible]) {
      comp.remove();
    }
  });
}

function obterUsuarioLogado() {
  return JSON.parse(sessionStorage.getItem("usuario"));
}

// armazena pág que o usuário estava antes de logar
const $login = document.getElementById("loginBtn");
$login.addEventListener("click", () => {
  const url = new URL(window.location.href);
  const loginRedirect = url.pathname + url.search;

  sessionStorage.setItem("login-redirect", loginRedirect);
});

abrirModal("carregamento");
definirVisibilidade();
fecharModal();
