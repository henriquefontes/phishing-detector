async function removerUsuario(id) {
  // Form Submit
  const formRemover = document.getElementById("formRemover");

  formRemover
    .querySelector('[data-prompt="nao"]')
    .addEventListener("click", () => {
      fecharModal("remover");
    });

  formRemover.querySelector(
    ".modal-description"
  ).innerHTML = `Você está prestes a remover o usuário selecionado.`;

  formRemover.addEventListener("submit", async (e) => {
    abrirModal("carregamento");
    e.preventDefault();

    await api.delete("usuarios/" + id);
    window.location.reload();

    fecharModal("carregamento");
  });

  abrirModal("remover");
}

async function banirUsuario(id, banido) {
  // Form Submit
  const formRemover = document.getElementById("formRemover");

  formRemover
    .querySelector('[data-prompt="nao"]')
    .addEventListener("click", () => {
      fecharModal("remover");
    });

  if (banido) {
    formRemover.querySelector(
      ".modal-description"
    ).innerHTML = `Você está prestes a desbanir o usuário selecionado.`;
  } else {
    formRemover.querySelector(
      ".modal-description"
    ).innerHTML = `Você está prestes a banir o usuário selecionado.`;
  }

  formRemover.addEventListener("submit", async (e) => {
    abrirModal("carregamento");
    e.preventDefault();

    await api.patch("usuarios/" + id, { banido: !banido });
    window.location.reload();

    fecharModal("carregamento");
  });

  abrirModal("remover");
}

async function verificarUsuario(id, verificado) {
  // Form Submit
  const formRemover = document.getElementById("formRemover");

  formRemover
    .querySelector('[data-prompt="nao"]')
    .addEventListener("click", () => {
      fecharModal("remover");
    });

  if (verificado) {
    formRemover.querySelector(
      ".modal-description"
    ).innerHTML = `Você está prestes a remover o verificado do usuário selecionado.`;
  } else {
    formRemover.querySelector(
      ".modal-description"
    ).innerHTML = `Você está prestes a verificar o usuário selecionado.`;
  }

  formRemover.addEventListener("submit", async (e) => {
    abrirModal("carregamento");
    e.preventDefault();

    await api.patch("usuarios/" + id, { verificado: !verificado });
    window.location.reload();

    fecharModal("carregamento");
  });

  abrirModal("remover");
}

async function editarUsuario(id) {
  abrirModal("carregamento");

  const $titulo = document.getElementById("tituloModalEdicao");
  const $nomeLabel = document.getElementById("nomeLabel");
  const $nome = document.getElementById("inputUsuarioNome");
  const $email = document.getElementById("inputUsuarioEmail");
  const $senha = document.getElementById("inputUsuarioSenha");

  const usuario = await api.get("usuarios/" + id);

  $titulo.innerText = usuario.empresa ? "Editar Empresa" : "Editar Usuário";
  $nomeLabel.innerText = usuario.empresa ? "CNPJ" : "Nome";
  $nome.value = usuario.nome;
  $email.value = usuario.email;
  $senha.value = usuario.senha;

  fecharModal("carregamento");

  // Ações
  const formEditarUsuario = document.getElementById("editUsuario");

  formEditarUsuario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = $nome.value;
    const email = $email.value;
    const senha = $senha.value;

    abrirModal("carregamento");

    if (usuario.empresa) {
      await api.patch("usuarios/" + id, { login: nome, email, senha });
    } else {
      await api.patch("usuarios/" + id, { nome, email, senha });
    }

    fecharModal();

    window.location.reload();
  });

  abrirModal("usuario");
}

function renderizarUsuarios(usuarios) {
  const tbody = document.querySelector("#gridUsuarios tbody");

  if (!usuarios) return;

  tbody.innerHTML = "";
  for (const usuario of usuarios) {
    tbody.innerHTML += `
      <tr>
        <td>
            <div class="flex-center" style="gap: 5px;">
            <span>${usuario.nome}</span>
            ${
              usuario.banido
                ? "<i class='bx bx-block remove-icon' ></i>"
                : usuario.verificado
                ? "<i class='bx bxs-badge-check verified-icon' ></i>"
                : ""
            }
            </div>
        </td>
        <td>${usuario.usuario}</td>
        <td>${usuario.email}</td>
        <td>
            <div class="grid-actions">
              <i class="bx bxs-cog setup-icon" onclick="editarUsuario(${
                usuario.id
              })"></i>
              <i class='bx bx-block remove-icon' onclick="banirUsuario(${
                usuario.id
              }, ${usuario.banido})"></i>
              <i class='bx bxs-badge-check verified-icon' onclick="verificarUsuario(${
                usuario.id
              }, ${usuario.verificado})"></i>
              <i class="bx bxs-x-circle remove-icon" onclick="removerUsuario(${
                usuario.id
              })"></i>
            </div>
        </td>
      </tr>
    `;
  }
}
function renderizarEmpresas(usuarios) {
  const tbody = document.querySelector("#gridEmpresas tbody");

  if (!usuarios) return;

  tbody.innerHTML = "";
  for (const usuario of usuarios) {
    tbody.innerHTML += `
      <tr>
        <td>
            <div class="flex-center" style="gap: 5px;">
            <span>${usuario.nome}</span>
            ${
              usuario.banido
                ? "<i class='bx bx-block remove-icon' ></i>"
                : usuario.verificado
                ? "<i class='bx bxs-badge-check verified-icon' ></i>"
                : ""
            }
            </div>
        </td>
        <td>${usuario.usuario}</td>
        <td>${usuario.email}</td>
        <td>
            <div class="grid-actions">
              <i class="bx bxs-cog setup-icon" onclick="editarUsuario(${
                usuario.id
              })"></i>
              <i class='bx bx-block remove-icon' onclick="banirUsuario(${
                usuario.id
              }, ${usuario.banido})"></i>
              <i class='bx bxs-badge-check verified-icon' onclick="verificarUsuario(${
                usuario.id
              }, ${usuario.verificado})"></i>
              <i class="bx bxs-x-circle remove-icon" onclick="removerUsuario(${
                usuario.id
              })"></i>
            </div>
        </td>
      </tr>
    `;
  }
}

async function trazerUsuarios() {
  const usuarios = await api.get("usuarios?empresa=false");

  return usuarios;
}

async function trazerEmpresas() {
  const empresas = await api.get("usuarios?empresa=true");

  return empresas;
}

async function trazerDominios(usuario) {
  const dominios = await api.get("dominios?empresa=" + usuario);

  return dominios;
}

async function trazerComentarios(usuario) {
  const dominios = await api.get("dominios");
  let comentarios = (await api.get("comentarios?usuario=" + usuario)) || [];

  comentarios = comentarios.map((comentario) => {
    return {
      ...comentario,
      dominio:
        dominios.find((dominio) => dominio.id == comentario.dominio)?.dominio ||
        "Domínio Removido",
    };
  });

  return comentarios;
}

async function carregarUsuario(id) {
  if (!id) return false;

  const usuario = await api.get("usuarios/" + id);

  if (!usuario) return false;

  return usuario;
}

async function carregarPagina() {
  const usuarioLogado = obterUsuarioLogado();

  if (!usuarioLogado || !usuarioLogado.admin) {
    window.location.href = "index.html";
  }

  abrirModal("carregamento");

  mudarAba(sessionStorage.getItem("aba") || "usuarios");

  const usuarios = await trazerUsuarios();
  const empresas = await trazerEmpresas();

  renderizarUsuarios(usuarios);
  renderizarEmpresas(empresas);

  fecharModal();
}

carregarPagina();
