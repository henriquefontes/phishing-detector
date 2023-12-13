function obterDominio(urlCompleta) {
  const url = new URL(urlCompleta);

  return url.hostname;
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

async function trazerComentarios(dominio) {
  let comentarios = await api.get("comentarios?dominio=" + dominio);
  const usuarios = await api.get("usuarios");

  if (!comentarios) return false;

  comentarios = comentarios.map((comentario) => {
    return {
      ...comentario,
      usuario:
        usuarios.find((usuario) => usuario.id == comentario.usuario)?.nome ||
        "Usuário Removido",
      id_usuario: comentario.usuario,
    };
  });

  return comentarios;
}

function renderizarComentarios(comentarios) {
  const container = document.querySelector(".comments-container");
  const usuario = obterUsuarioLogado();

  for (const comentario of comentarios) {
    container.innerHTML += `
        <div class="comment-wrapper">
          ${
            usuario?.id == comentario.id_usuario
              ? `
            <div class="comment-actions" data-visible="user-page-only">
              <i class="bx bxs-trash-alt trash-icon" onclick="removerComentario(${comentario.id})"></i>
              <i class="bx bxs-pencil edit-icon" onclick="editarComentario(${comentario.id})"></i>
            </div>
          `
              : ""
          }
          <div class="comment">
            <div class="comment-details">
              <h4 class="comment-author">${comentario.usuario}</h4>
              <h4 class="comment-date">${comentario.data}</h4>
            </div>
            <p class="comment-text">${comentario.texto}</p>
          </div>
        </div>
    `;

    const textarea = document.querySelector(".comment-add-text");
    if (textarea) {
      textarea.addEventListener("input", () => {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      });
    }
  }
}

async function likeDominio(id) {
  const dados = await api.get("dominios/" + id);
  const novosDados = await api.patch("dominios/" + id, {
    likes: dados.likes + 1,
  });

  return novosDados.likes;
}

async function dislikeDominio(id) {
  const dados = await api.get("dominios/" + id);
  const novosDados = await api.patch("dominios/" + id, {
    dislikes: dados.dislikes + 1,
  });

  return novosDados.dislikes;
}

async function obterDados(dominio) {
  const dados = await api.get("dominios?dominio=" + dominio);
  return dados;
}

async function inserirDominio(dominio) {
  await api.post("dominios", {
    dominio: dominio,
    likes: 0,
    dislikes: 0,
  });
}

async function carregarPagina() {
  const url = new URL(window.location.href);
  const dominio = url.searchParams.get("dominio");

  if (!dominio) window.location.href = "index.html";

  abrirModal("carregamento");

  let dados = await obterDados(dominio);
  // Se não existir informações sobre o domínio na API, insere
  if (!dados) {
    await inserirDominio(dominio);
    window.location.reload();
  } else {
    dados = dados[0];
  }

  // Submit Busca URL
  const formURL = document.getElementById("formUrl");
  formURL.addEventListener("submit", (e) => {
    e.preventDefault();

    let url = formURL.querySelector('[name="url"]').value;
    if (!(url.includes("http://") || url.includes("https://"))) {
      url = "https://" + url;
    }

    const dominio = obterDominio(url);

    window.location.href = "search.html?dominio=" + dominio;
  });

  // URL - Título
  document.querySelector(".domain-query").innerText = dominio;

  // Likes e Dislikes
  const $likeBtn = document.querySelector(".like-button");
  const $dislikeBtn = document.querySelector(".dislike-button");
  const $likes = document.getElementById("likes-counter");
  const $dislikes = document.getElementById("dislikes-counter");

  $likes.innerText = dados.likes;
  $dislikes.innerText = dados.dislikes;

  $likeBtn.onclick = async () => {
    abrirModal("carregamento");

    const likes = await likeDominio(dados.id);
    $likes.innerText = likes;

    fecharModal();
  };
  $dislikeBtn.onclick = async () => {
    abrirModal("carregamento");

    const dislikes = await dislikeDominio(dados.id);
    $dislikes.innerText = dislikes;

    fecharModal();
  };

  // Comentários
  const comentarios = await trazerComentarios(dados.id);
  if (comentarios) renderizarComentarios(comentarios);

  // API Virus Total
  //Faz a busca na API
  // Obtem os valores
  var gridClassificacoes = document.getElementById("gridClassificacoes");
  var campoNotas = document.getElementById("notas");
  var campoVeredito = document.getElementById("veredito");

  // Define as opções da requisição HTTP
  const options = {
    method: "GET",
    credentials: "include",
    mode: "cors",
    headers: {
      accept: "application/json",
      "x-apikey":
        "2c8dcd68b374477e0325b2393bb7e4077d9c99d56467ff7ef2f19e532eca7bc2",
    },
  };

  // Configura a URL de busca na API
  var urlBusca =
    "https://justcors.com/tl_6428a3c/https://www.virustotal.com/api/v3/domains/" +
    dominio;

  // Realizar a requisição Fetch
  const req = await fetch(urlBusca, options);
  const data = await req.json();
  //Busca os dados da API e guarda em variáveis
  const categorias = data.data.attributes.categories;
  const votos = data.data.attributes.total_votes;

  //Lista as categorias -> Itera em cada empresa -> Cria uma linha na tabela -> Coloca a tabela na tela
  let categoriasUnicas = Object.keys(categorias);
  let resultadoCategorias =
    "<thead><tr><th>Empresa</th><th>Classificação</th></tr></thead><tbody>";
  categoriasUnicas.forEach((categ) => {
    resultadoCategorias += `<tr>
                <td> ${categ} </td>
                <td> ${categorias[categ]} </td>
                </tr>
                `;
  });
  resultadoCategorias += "</tbody>";
  gridClassificacoes.innerHTML = resultadoCategorias;

  //Exibe a saída do veredito com base na avaliação de harmless e malicioso
  let votosUnicos = Object.keys(votos);
  let resultadoVotos = "<table><tr><th>Voto</th><th>Quantidade</th></tr>";
  let maior = 0;
  let result = "";
  votosUnicos.forEach((voto) => {
    resultadoVotos += `<tr>
                <td> ${voto} </td>
                <td> ${votos[voto]} </td>
                </tr>
                `;

    if (votos[voto] > maior) {
      maior = votos[voto];
      result = voto;
    }
  });
  if (result == "harmless") {
    result = `<h3 style='color: white; font-size: 30px; margin-bottom: 15px; font-weight: 600'>
          Este domínio é <span style='color: var(--green-color)'>confiável</span>
      </h3>`;
  } else if (result == "malicious") {
    result = `<h3 style='color: white; font-size: 30px; margin-bottom: 15px; font-weight: 600'>
          Este domínio é <span style='color: var(--red-color)'>malicioso</span>
      </h3>`;
  } else {
    result = `<h3 style='color: white; font-size: 30px; margin-bottom: 15px; font-weight: 600'>
          Oops, não temos critérios para este domínio.
      </h3>`;
  }
  resultadoVotos += "</table>";
  campoNotas.innerHTML = resultadoVotos;
  campoVeredito.innerHTML = result;

  // Responsável pelo domínio
  if (dados.empresa) {
    const [empresa] = await api.get("usuarios?id=" + dados.empresa);

    document.getElementById("domain-owner-caption").classList.remove("d-none");
    document.getElementById("domain-owner").innerText = empresa.nome;
    document.getElementById("domain-owner").href =
      "usuario.html?id=" + empresa.id;
  }

  // Adicionar comentário
  const usuario = obterUsuarioLogado();
  if (usuario) {
    document
      .getElementById("send-comment")
      .addEventListener("click", async () => {
        const comentario = document.querySelector(".comment-add-text").value;

        if (!comentario.length) return;

        abrirModal("carregamento");

        await api.post("comentarios", {
          usuario: usuario.id,
          texto: comentario,
          data: new Date().toLocaleDateString(),
          dominio: dados.id,
        });

        window.location.reload();

        fecharModal();
      });
  }

  mudarAba("comentarios");

  fecharModal();
}

carregarPagina();
