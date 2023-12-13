const formSignUpUser = document.getElementById("formSignUpUser");

formSignUpUser.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cnpj = document.getElementById("cnpj").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const signUpData = {
    usuario: cnpj,
    nome: nome,
    email: email,
    empresa: true,
    senha: senha,
    foto: "assets/img/default-profile.jpg",
  };

  abrirModal("carregamento");

  await api.post("usuarios", signUpData);
  window.location.href = "../../login.html";
});
