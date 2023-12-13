async function removerDominio(id) {
  // Form Submit
  const formRemover = document.getElementById("formRemover");

  formRemover
    .querySelector('[data-prompt="nao"]')
    .addEventListener("click", () => {
      fecharModal("remover");
    });

  formRemover.querySelector(
    ".modal-description"
  ).innerHTML = `O domínio será desvinculado de sua empresa.`;

  formRemover.addEventListener("submit", async (e) => {
    abrirModal("carregamento");
    e.preventDefault();

    await api.patch("dominios/" + id, { empresa: null });
    window.location.reload();

    fecharModal("carregamento");
  });

  abrirModal("remover");
}

async function removerComentario(id) {
  // Form Submit
  const formRemover = document.getElementById("formRemover");

  formRemover
    .querySelector('[data-prompt="nao"]')
    .addEventListener("click", () => {
      fecharModal("remover");
    });

  formRemover.addEventListener("submit", async (e) => {
    abrirModal("carregamento");
    e.preventDefault();

    await api.delete("comentarios/" + id);
    window.location.reload();

    fecharModal("carregamento");
  });

  abrirModal("remover");
}

async function editarComentario(id) {
  const $comentario = document.getElementById("comentario-input");

  abrirModal("carregamento");

  const comentario = await api.get("comentarios/" + id);

  $comentario.value = comentario.texto;

  fecharModal("carregamento");

  // Form Submit
  const formEditarComentario = document.getElementById("editCmt");

  formEditarComentario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const texto = formEditarComentario.querySelector(
      'textarea[name="comentario"]'
    ).value;

    abrirModal("carregamento");

    await api.patch("comentarios/" + id, { texto });

    fecharModal();

    window.location.reload();
  });

  abrirModal("editComment");
}

function renderizarUsuario(usuario) {
  const $inputUsuarioNome = document.getElementById("inputUsuarioNome");
  const $usuarioImagem = document.querySelectorAll(".usuario-image");
  const $usuarioNome = document.querySelectorAll(".usuario-name");
  const $usuarioSobre = document.querySelectorAll(".details-description");

  $usuarioImagem.forEach(($el) => ($el.src = usuario.foto));

  $usuarioNome.forEach(($el) => ($el.innerText = usuario.nome));
  $usuarioSobre.forEach(
    ($el) => ($el.innerText = usuario.sobre || "Nenhuma informação.")
  );

  if ($inputUsuarioNome) {
    $inputUsuarioNome.value = usuario.nome;
  }
}

document
  .querySelector(".edit-icon-container")
  .addEventListener("click", function () {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.addEventListener("change", async function () {
      atualizarFotoPreview(this);
    });
  });

async function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// Função para atualizar a foto no formulário editprof
function atualizarFotoPreview(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const usuarioImagem = document.querySelector(".usuario-image-edit");
      usuarioImagem.src = e.target.result;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

async function renderizarDominios(dominios) {
  const tbody = document.querySelector("#gridDominios tbody");

  tbody.innerHTML = "";
  for (const dominio of dominios) {
    tbody.innerHTML += `
      <tr>
        <td>${dominio.dominio}</td>
        <td>${dominio.likes}</td>
        <td>${dominio.dislikes}</td>
        <td>
          <a href="search.html?dominio=${dominio.dominio}">
            <i class='bx bx-search-alt' style="color: white; font-size: 20px"></i>
          </a>
          <i class='bx bxs-trash-alt remove-icon' 
             style="margin-right: 5px; font-size: 20px; cursor: pointer" 
             data-visible="is-current-user-page"
             onclick="removerDominio(${dominio.id})"
          ></i>
        </td>
      </tr>
    `;
  }

  await definirVisibilidade();
}

function renderizarComentarios(comentarios) {
  const container = document.querySelector(".comments-container");

  for (const comentario of comentarios) {
    container.innerHTML += `
        <div class="comment-wrapper">
        ${
          obterUsuarioLogado()?.id == comentario.usuario
            ? `
          <div class="comment-actions">
            <i class="bx bxs-trash-alt trash-icon" onclick="removerComentario(${comentario.id})"></i>
            <i class="bx bxs-pencil edit-icon" onclick="editarComentario(${comentario.id})"></i>
          </div>
        `
            : ""
        }
          <div class="comment">
            <div class="comment-details">
            <a href="search.html?dominio=${
              comentario.dominio
            }"><h4 class="comment-author">${comentario.dominio}</h4></a>
              <h4 class="comment-date">${comentario.data}</h4>
            </div>
            <p class="comment-text">${comentario.texto}</p>
          </div>
        </div>
    `;
  }
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
  abrirModal("carregamento");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const usuario = await carregarUsuario(id);

  if (!usuario) {
    notyf.error({
      message: "Erro ao buscar o usuário/empresa!",
      dismissible: false,
      duration: 10000,
    });
    return;
  }

  renderizarUsuario(usuario);

  //
  if (usuario.empresa) {
    const dominiosEmpresa = await trazerDominios(id);

    if (dominiosEmpresa) await renderizarDominios(dominiosEmpresa);
  } else {
    const comentarios = await trazerComentarios(id);

    if (comentarios) renderizarComentarios(comentarios);
  }

  const dominiosAbaBotao = document.querySelector(
    '[data-tab-header="domains"]'
  );
  const comentariosAbaBotao = document.querySelector(
    '[data-tab-header="comments"]'
  );
  if (usuario.empresa) {
    mudarAba(dominiosAbaBotao);
  } else {
    mudarAba(comentariosAbaBotao);
  }

  fecharModal();

  if (document.getElementById("add-domain")) {
    document.getElementById("add-domain").addEventListener("click", () => {
      if (!usuario.verificado) {
        notyf.error({
          message: "Sua empresa precisa ser verificada para realizar a ação.",
          dismissible: false,
          duration: 10000,
        });
        return;
      }

      abrirModal("addDomains");
    });
  }

  // Submit Formulários
  const formCadastroDominio = document.getElementById("cadDom");
  const formEdicaoPerfil = document.getElementById("editProf");

  formCadastroDominio.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dominio = document.querySelector("#cadDom input").value;
    const hostname = new URL(dominio).hostname;

    abrirModal("carregamento");

    // Verifica se o domínio já existe
    const dominioExistente = await api.get("dominios?dominio=" + hostname);

    if (dominioExistente) {
      if (dominioExistente[0].empresa) {
        notyf.error({
          message: "Domínio já cadastrado ou pertencente à outra empresa.",
          dismissible: false,
          duration: 10000,
        });
        fecharModal();
        return;
      } else {
        await api.patch("dominios/" + dominioExistente[0].id, { empresa: id });
      }
    } else {
      await api.post("dominios", {
        empresa: id,
        dominio: hostname,
        likes: 0,
        dislikes: 0,
      });
    }

    fecharModal();

    window.location.reload();
  });

  formEdicaoPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    const foto = formEdicaoPerfil.querySelector("img").src;
    const sobre = formEdicaoPerfil.querySelector("textarea").value;

    abrirModal("carregamento");

    if (!usuario.empresa) {
      const nome = formEdicaoPerfil.querySelector('input[name="nome"]').value;

      await api.patch("usuarios/" + id, { nome, sobre, foto });

      usuario.nome = nome;
      usuario.sobre = sobre;
      usuario.foto = foto;

      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      usuario.sobre = sobre;
      usuario.foto = foto;

      await api.patch("usuarios/" + id, { sobre, foto });
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
    }

    fecharModal();

    window.location.reload();
  });
}

carregarPagina();
