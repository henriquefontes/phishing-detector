const $formUrl = document.getElementById("formUrl");

$formUrl.addEventListener("submit", (e) => {
  e.preventDefault();

  const url = new URL($formUrl.querySelector("input").value);
  const dominio = url.hostname;

  window.location.href = "./search.html?dominio=" + dominio;
});

async function verPost(post) {
  abrirModal("carregamento");

  const dados = await api.get("posts/" + post);

  fecharModal();

  const $imagem = document.getElementById("postImg");
  const $titulo = document.getElementById("postTitle");
  const $texto = document.getElementById("postDesc");

  $imagem.src =
    "https://www.tre-se.jus.br/imagens/fotos/tre-se-entenda-o-que-e-phishing/@@images/6b38023a-b3de-4c64-9919-d79a5a2fb34a.jpeg";
  $titulo.innerText = dados.titulo;
  $texto.innerText = dados.conteudo;

  abrirModal("verPost");
}

function renderizarRanking(links) {
  const container = document.querySelector(".ranking-items");

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let position = "";

    if (i == 0) position = "first";
    else if (i == 1) position = "second";

    container.innerHTML += `
      <div class="ranking-item">
        <i class="ranking-item-icon ${position} bx bxs-trophy"></i>
        <span class="ranking-item-domain">${link.dominio}</span>
        <span class="ranking-item-likes"
          ><i class="bx bxs-like"></i> ${link.likes}</span
        >
      </div>
    `;
  }
}

function renderizarPosts(posts) {
  const container = document.querySelector(
    ".home-section-wrapper .home-section-cards"
  );

  for (const post of posts) {
    container.innerHTML += `
      <div class="home-section-card our-blog-card">
        <img
          class="our-blog-card-image"
          src="https://www.tre-se.jus.br/imagens/fotos/tre-se-entenda-o-que-e-phishing/@@images/6b38023a-b3de-4c64-9919-d79a5a2fb34a.jpeg"
        />
        <h3 class="our-blog-card-title">
          ${post.titulo}
        </h3>
        <p class="our-blog-card-description">
          ${
            post.conteudo.length > 100
              ? post.conteudo.slice(0, 121) + "..."
              : post.conteudo
          }
        </p>
        <button class="button filled" style="height: 35px" onclick="verPost(${
          post.id
        })">LER MAIS</button>
      </div>
    `;
  }
}

async function carregarPagina() {
  abrirModal("carregamento");

  const posts = (await api.get("posts?_sort=id&_order=desc")).filter(
    (val, i) => i < 3
  );
  const links = (await api.get("dominios?_sort=likes&_order=desc")).filter(
    (val, i) => i < 3
  );

  renderizarPosts(posts);
  renderizarRanking(links);

  fecharModal();
}

carregarPagina();
