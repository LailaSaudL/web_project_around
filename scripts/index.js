// --------- SELECCIÓN DE ELEMENTOS ---------
const profilePopup = document.getElementById("profile-popup");
const cardPopup = document.getElementById("card-popup");
const imagePopup = document.getElementById("image-popup");

// Botones
const editButton = document.getElementById("edit-button");
const closeProfileButton = document.getElementById("close-button");

const addCardButton = document.getElementById("add-card");
const closeCardButton = document.getElementById("close-card");

const closeImageButton = document.getElementById("close-image");

// Like
document.querySelectorAll(".card__like-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("card__like-button_active");
  });
});

// Inputs del formulario de perfil
const nameInput = document.getElementById("name-profile");
const jobInput = document.getElementById("job-profile");

// Elementos de texto del perfil
const profileName = document.querySelector(".profile__name");
const profileText = document.querySelector(".profile__text");

// Formulario
const profileForm = document.getElementById("profile-form");

// --------- FUNCIONALIDAD POPUPS ---------

// Editar perfil
editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileText.textContent;
  profilePopup.showModal();
});

closeProfileButton.addEventListener("click", () => {
  profilePopup.close();
});

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profileName.textContent = nameInput.value;
  profileText.textContent = jobInput.value;
  profilePopup.close();
});

// Agregar tarjeta
addCardButton.addEventListener("click", () => {
  cardPopup.showModal();
});

closeCardButton.addEventListener("click", () => {
  cardPopup.close();
});

// Ver imagen en grande (a completar cuando crees tarjetas dinámicas)
closeImageButton.addEventListener("click", () => {
  imagePopup.close();
});
