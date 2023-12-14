// -------- Animação Texto Carregamento --------
const textoCarregamento = document.querySelector(".loading h3");
const textosCarregamento = ["Pescando Informações"];

// -------- Tab Menu --------
const abaAtual = document.querySelector(`*[data-tab-header].active`);
const abasBotoes = document.querySelectorAll("*[data-tab-header]");
const abaSublinhado = document.querySelector(".tab-underline");

if (abaAtual) {
  abaSublinhado.style.width = abaAtual.clientWidth + "px";
}

function mudarAba(abaBotao) {
  let abaSublinhada;

  if (typeof abaBotao === "string") {
    abaSublinhada = abaBotao;
  } else {
    abaSublinhada = abaBotao.dataset.tabHeader;
  }

  abaBotao = document.querySelector(`[data-tab-header="${abaSublinhada}"`);

  const abaSublinhadaEl = document.querySelector(
    `*[data-tab="${abaSublinhada}"]`
  );
  const abaAtual = document.querySelector(`*[data-tab].active`);
  const abaAtualBotao = document.querySelector(".tab-button.active");

  if (abaAtualBotao && abaAtual) {
    abaAtualBotao.classList.remove("active");
    abaAtual.classList.remove("active");
  }

  abaBotao.classList.add("active");
  abaSublinhadaEl.classList.add("active");

  abaSublinhado.style.width = abaBotao.clientWidth + "px";

  if (abaSublinhado.offsetLeft < abaBotao.offsetLeft) {
    const translateVal = abaSublinhado.offsetLeft + abaBotao.offsetLeft;

    abaSublinhado.style.transform = `translateX(${translateVal}px)`;
  } else {
    const translateVal = abaSublinhado.offsetLeft - abaBotao.offsetLeft;

    abaSublinhado.style.transform = `translateX(${translateVal}px)`;
  }

  // -------- Limite Máximo de Altura dos Menus --------
  // const abasBotoesContainer = document.querySelectorAll(".tab-container");

  // abasBotoesContainer.forEach((container) => {
  //   container.style.maxHeight = `calc(100vh - ${container.offsetTop}px)`;
  // });
}

abasBotoes.forEach((abaBotao) => {
  abaBotao.addEventListener("click", () => {
    mudarAba(abaBotao);
  });
});

// -------- Modal --------
function abrirModal(modalName) {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const modals = document.querySelectorAll("[data-modal]");
  const modal = document.querySelector(`[data-modal="${modalName}"]`);

  modals.forEach((modal) => modal.classList.remove("active"));
  modal.classList.add("active");

  modalWrapper.classList.add("active");
  document.querySelector("body").style.overflow = "hidden";
}

function fecharModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
  const activeModal = document.querySelector(".modal.active");

  if (!activeModal) return;

  modalWrapper.classList.remove("active");
  activeModal.classList.remove("active");
  document.querySelector("body").style.overflowY = "scroll";
}

document.querySelectorAll(".modal-close-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    fecharModal();
  });
});

document.querySelectorAll("[data-open-modal]").forEach((btn) => {
  btn.addEventListener("click", () => {
    abrirModal(btn.dataset.openModal);
  });
});

// -------- Animação Texto Carregamento --------
if (textoCarregamento) {
  setInterval(() => {
    const texto = textoCarregamento.innerHTML;
    const randomIndex = Math.floor(Math.random() * textosCarregamento.length);

    if (texto.endsWith("...") || !texto) {
      textoCarregamento.innerHTML = textosCarregamento[randomIndex];
    } else {
      textoCarregamento.innerHTML += ".";
    }
  }, 500);
}

// ---- Nav Perfil -----
const $usuario = document.querySelector(
  ".logged-user-image:not(.mobile-user-image)"
);
const $acoesUsuario = document.querySelector(".logged-user-actions");

if ($usuario && $acoesUsuario) {
  $usuario.addEventListener("click", (e) => {
    e.stopPropagation();
    $acoesUsuario.classList.toggle("d-none");
  });
  window.addEventListener("click", () => {
    $acoesUsuario.classList.add("d-none");
  });
  // Dados Usuário
  const usuarioLogado = JSON.parse(sessionStorage.getItem("usuario"));
  document.querySelectorAll(".logged-user-image").forEach((img) => {
    img.src = usuarioLogado?.foto;
  });
  document.querySelectorAll(".my-profile").forEach((mp) => {
    mp.href = "usuario.html?id=" + usuarioLogado?.id;
  });
}

// --- Logout ---
const $logout = document.querySelectorAll(".logout");

if ($logout.length) {
  $logout.forEach((el) => {
    el.addEventListener("click", () => {
      sessionStorage.removeItem("usuario");
      window.location.reload();
    });
  });
}

// --- Menu Mobile ---
if (document.querySelector(".mobile-menu-icon")) {
  document.querySelector(".mobile-menu-icon").addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelector(".mobile-menu-wrapper").classList.add("open");
    document.querySelector(".mobile-menu-container").classList.add("open");
    document.querySelector("body").style.overflow = "hidden";
  });

  document.querySelector(".close-mobile-menu").addEventListener("click", () => {
    document.querySelector(".mobile-menu-wrapper").classList.remove("open");
    document.querySelector(".mobile-menu-container").classList.remove("open");
    document.querySelector("body").style.overflow = "auto";
  });

  window.addEventListener("click", () => {
    document.querySelector(".mobile-menu-wrapper").classList.remove("open");
    document.querySelector(".mobile-menu-container").classList.remove("open");
    document.querySelector("body").style.overflow = "auto";
  });
}

const header = document.querySelector("header");
if (header) {
  document.querySelector("header + *").style.paddingTop =
    header.clientHeight + "px";

  window.addEventListener("scroll", () => {
    if (window.scrollY > header.clientHeight + 10) {
      document.querySelector("header").classList.add("header-filled");
    } else {
      document.querySelector("header").classList.remove("header-filled");
    }
  });
}

const notyf = new Notyf();
