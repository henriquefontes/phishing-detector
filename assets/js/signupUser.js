const formSignUpUser = document.getElementById("formSignUpUser");

formSignUpUser.addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const signUpData = {
    usuario: usuario,
    nome: nome,
    email: email,
    empresa: false,
    senha: senha,
    foto: "assets/img/default-profile.jpg",
  };

  abrirModal("carregamento");

  await api.post("usuarios", signUpData);
  window.location.href = "../../login.html";
});
