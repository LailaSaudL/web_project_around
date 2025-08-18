import { enableValidation, resetValidation } from "./validate.js";

// --------- SELECCIÓN DE ELEMENTOS ---------
const profilePopup = document.getElementById("profile-popup");
const cardPopup = document.getElementById("card-popup");

// Botones
const editButton = document.getElementById("edit-button");
const closeProfileButton = document.getElementById("close-button");
const addCardButton = document.getElementById("add-card");
const closeCardButton = document.getElementById("close-card");

// Inputs del formulario de perfil
const nameInput = document.getElementById("name-profile");
const jobInput = document.getElementById("job-profile");
const profileName = document.querySelector(".profile__name");
const profileText = document.querySelector(".profile__text");

// Like
document.querySelectorAll(".card__like-button").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("card__like-button_active");
  });
});

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

// --------- POPUP DE IMAGEN FUNCIONAL ---------

const imagePopup = document.getElementById("popup-image");
const popupImageElement = imagePopup.querySelector(".popup__img");
const popupImageTitle = imagePopup.querySelector(".popup__img-title");
const closeImageButton = document.getElementById("popup-image-close-button");

function openImagePopup(name, link) {
  popupImageElement.src = link;
  popupImageElement.alt = name;
  popupImageTitle.textContent = name;
  imagePopup.classList.add("popup_opened");
}

closeImageButton.addEventListener("click", () => {
  imagePopup.classList.remove("popup_opened");
});

// Añadir evento a todas las imágenes existentes
document.querySelectorAll(".card__image").forEach((img) => {
  img.addEventListener("click", () => {
    const name = img.alt;
    const link = img.src;
    openImagePopup(name, link);
  });
});

// --------- SELECCIÓN DE ELEMENTOS PARA NUEVA TARJETA ---------
const cardForm = document.getElementById("card-form");
const titleInput = document.getElementById("card-title");
const urlInput = document.getElementById("card-url");
const cardsContainer = document.getElementById("cards-container");
const cardTemplate = document.getElementById("card-template").content;

// --------- FUNCIÓN PARA CREAR Y AÑADIR TARJETA ---------
function createCard(name, link) {
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Like
  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like-button_active");
  });

  // Popup de imagen
  cardImage.addEventListener("click", () => {
    openImagePopup(name, link);
  });

  // Insertar al principio
  cardsContainer.prepend(cardElement);
}

// --------- CONTROLADOR DEL FORMULARIO DE NUEVA TARJETA ---------
cardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = titleInput.value.trim();
  const link = urlInput.value.trim();

  if (name && link) {
    createCard(name, link);
    cardForm.reset();
    cardPopup.close(); // Cierra el dialog
  }
});

// --------- BOTON PARA BORRAR TARJETAS ---------
cardsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("card__delete-button")) {
    const card = e.target.closest(".card");
    card.remove();
  }
});

// ---------- CIERRE GENÉRICO (overlay + ESC) ----------
function isDialog(el) {
  return el && el.tagName === "DIALOG";
}

function closePopup(popup) {
  if (!popup) return;
  if (isDialog(popup)) {
    popup.close();                 // <dialog>
  } else {
    popup.classList.remove("popup_opened");  // div#popup-image
  }
}

// Cerrar al hacer clic en la superposición (fuera del contenedor)
document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    // Si el click NO ocurrió dentro del contenido (.popup__container), es overlay
    const clickedOutside = !evt.target.closest(".popup__container");
    if (clickedOutside) closePopup(popup);
  });
});

// Cerrar con la tecla Esc
function handleEscClose(evt) {
  if (evt.key !== "Escape") return;

  // Prioriza <dialog> abierto; si no, el popup de imagen
  const openedDialog = document.querySelector("dialog.popup[open]");
  if (openedDialog) {
    closePopup(openedDialog);
    return;
  }

  const openedDivPopup = document.querySelector(".popup.popup_opened");
  if (openedDivPopup) {
    closePopup(openedDivPopup);
  }
}

document.addEventListener("keydown", handleEscClose);


// --------- ACTIVAR VALIDACIÓN ---------
enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
});
