import { FormValidator } from "./FormValidator.js";
import { openPopup, closePopup } from "./utils.js";

/* ------------------ Config validación ------------------ */
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

/* ------------------ Selectores / elementos ------------------ */
const profilePopup = document.getElementById("profile-popup");
const cardPopup = document.getElementById("card-popup");
const imagePopup = document.getElementById("popup-image");

const editButton = document.getElementById("edit-button");
const closeProfileButton = document.getElementById("close-button");
const addCardButton = document.getElementById("add-card");
const closeCardButton = document.getElementById("close-card");

const profileForm = document.getElementById("profile-form");
const cardForm = document.getElementById("card-form");

const nameInput = document.getElementById("name-profile");
const jobInput = document.getElementById("job-profile");
const profileName = document.querySelector(".profile__name");
const profileText = document.querySelector(".profile__text");

const popupImageElem = imagePopup ? imagePopup.querySelector(".popup__img") : null;
const popupImageTitle = imagePopup ? imagePopup.querySelector(".popup__img-title") : null;
const popupImageCloseBtn = document.getElementById("popup-image-close-button");

const cardsContainer = document.getElementById("cards-container");
const cardTemplate = document.getElementById("card-template");

/* ------------------ Validadores (instancias) ------------------ */
let profileValidator = null;
let cardValidator = null;

if (profileForm) {
  profileValidator = new FormValidator(validationConfig, profileForm);
  profileValidator.enableValidation();
}

if (cardForm) {
  cardValidator = new FormValidator(validationConfig, cardForm);
  cardValidator.enableValidation();
}

/* ------------------ Helpers: abrir/cerrar imagen ------------------ */
function openImagePopup(name, link) {
  if (!popupImageElem || !popupImageTitle) return;
  popupImageElem.src = link;
  popupImageElem.alt = name;
  popupImageTitle.textContent = name;
  openPopup(imagePopup);
}

/* ------------------ Crear tarjeta desde template ------------------ */
function createCardElement(name, link) {
  if (!cardTemplate) return null;
  const cardFragment = cardTemplate.content.cloneNode(true);
  const cardEl = cardFragment.querySelector(".card");
  const img = cardEl.querySelector(".card__image");
  const title = cardEl.querySelector(".card__title");
  const likeBtn = cardEl.querySelector(".card__like-button");
  const delBtn = cardEl.querySelector(".card__delete-button");

  if (img) {
    img.src = link;
    img.alt = name;
    img.addEventListener("click", () => openImagePopup(name, link));
  }
  if (title) title.textContent = name;

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("card__like-button_active");
    });
  }

  if (delBtn) {
    delBtn.addEventListener("click", () => {
      const cardNode = delBtn.closest(".card");
      if (cardNode) cardNode.remove();
    });
  }

  return cardEl;
}

/* ------------------ Event handlers: botones/popups ------------------ */
if (editButton) {
  editButton.addEventListener("click", () => {
    // rellenar inputs con el perfil actual
    if (profileName) nameInput.value = profileName.textContent || "";
    if (profileText) jobInput.value = profileText.textContent || "";

    // resetear validación (si existe)
    if (profileValidator) profileValidator.resetValidation();

    openPopup(profilePopup);
  });
}

if (closeProfileButton) {
  closeProfileButton.addEventListener("click", () => closePopup(profilePopup));
}

if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (profileName) profileName.textContent = nameInput.value;
    if (profileText) profileText.textContent = jobInput.value;
    closePopup(profilePopup);
  });
}

if (addCardButton) {
  addCardButton.addEventListener("click", () => {
    if (cardValidator) cardValidator.resetValidation();
    openPopup(cardPopup);
  });
}

if (closeCardButton) {
  closeCardButton.addEventListener("click", () => closePopup(cardPopup));
}

if (cardForm) {
  cardForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("card-title").value.trim();
    const url = document.getElementById("card-url").value.trim();
    if (!title || !url) return;
    const newCard = createCardElement(title, url);
    if (newCard && cardsContainer) {
      cardsContainer.prepend(newCard);
    }
    cardForm.reset();
    closePopup(cardPopup);
  });
}

/* ------------------ Image popup close button ------------------ */
if (popupImageCloseBtn) {
  popupImageCloseBtn.addEventListener("click", () => closePopup(imagePopup));
}

/* ------------------ Cerrar con clic en el overlay (fondo) ------------------ */
document.querySelectorAll(".popup").forEach(popup => {
  popup.addEventListener("click", (evt) => {
    // si el target es exactamente el overlay (no un hijo)
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

/* ------------------ Cerrar con ESC ------------------ */
document.addEventListener("keydown", (evt) => {
  if (evt.key !== "Escape") return;
  // Priorizar dialog abierto
  const openedDialog = document.querySelector("dialog.popup[open]");
  if (openedDialog) {
    closePopup(openedDialog);
    return;
  }
  const openedDiv = document.querySelector(".popup.popup_opened");
  if (openedDiv) closePopup(openedDiv);
});

/* ------------------ Inicial: añadir listeners a imágenes estáticas (si las hay) ------------------ */
document.querySelectorAll(".card__image").forEach(img => {
  img.addEventListener("click", () => {
    openImagePopup(img.alt || "", img.src || "");
  });
});
