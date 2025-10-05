import { api } from "./Api.js";
import { Card } from "./components/Card.js";
import { PopupWithImage } from "./components/PopupWithImage.js";
import { PopupWithForm } from "./components/PopupWithForm.js";
import { PopupWithConfirmation } from "./components/PopupWithConfirmation.js";
import { UserInfo } from "./components/UserInfo.js";
import { FormValidator } from "./FormValidator.js";

// ----- SELECTORES / ELEMENTOS -----
const profileEditBtn = document.getElementById("edit-button");
const profileCloseBtn = document.getElementById("close-button");
const addCardBtn = document.getElementById("add-card");
const addCardCloseBtn = document.getElementById("close-card");

const profileForm = document.getElementById("profile-form");
const cardForm = document.getElementById("card-form");
const avatarForm = document.getElementById("avatar-form"); // (ver HTML que incluyo abajo)

const nameInput = document.getElementById("name-profile");
const jobInput = document.getElementById("job-profile");

const cardsContainer = document.getElementById("cards-container");

// ----- INSTANCIAS UTILES -----
let currentUserId = null;

// userInfo maneja texto y avatar en DOM (implementa setUserInfo, setUserAvatar en tu UserInfo.js)
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  aboutSelector: ".profile__text",
  avatarSelector: ".profile__avatar",
});

// Popups
const imagePopup = new PopupWithImage("#popup-image");
imagePopup.setEventListeners();

const confirmPopup = new PopupWithConfirmation("#confirm-popup");
confirmPopup.setEventListeners();

// Profile popup (editar nombre + job)
const profilePopup = new PopupWithForm("#profile-popup", (formValues) => {
  // formValues expected keys: { 'name-profile': '...', 'job-profile': '...' } depending how inputs are named/ids
  return api.setUserInfo({
    name: formValues["name-profile"] || formValues.name,
    about: formValues["job-profile"] || formValues.about,
  }).then((updatedUser) => {
    userInfo.setUserInfo({
      name: updatedUser.name,
      about: updatedUser.about,
    });
  });
});
profilePopup.setEventListeners();

// Add card popup
const addCardPopup = new PopupWithForm("#card-popup", (formValues) => {
  return api.addCard({
    name: formValues["card-title"] || formValues.name,
    link: formValues["card-url"] || formValues.link,
  }).then((newCardData) => {
    // newCardData is the card object returned by server (with _id, owner, likes...)
    const cardEl = createCard(newCardData);
    cardsContainer.prepend(cardEl);
  });
});
addCardPopup.setEventListeners();

// Avatar popup
const avatarPopup = new PopupWithForm("#avatar-popup", (formValues) => {
  // espera objeto { 'avatar-url': 'https://...' } (según id de input)
  return api.updateAvatar({ avatar: formValues["avatar-url"] || formValues.avatar })
    .then((updatedUser) => {
      userInfo.setUserAvatar(updatedUser.avatar);
    });
});
avatarPopup.setEventListeners();

// ----- VALIDACIÓN -----
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const profileValidator = new FormValidator(validationConfig, profileForm);
profileValidator.enableValidation();
const cardValidator = new FormValidator(validationConfig, cardForm);
cardValidator.enableValidation();
const avatarValidator = avatarForm ? new FormValidator(validationConfig, avatarForm) : null;
if (avatarValidator) avatarValidator.enableValidation();

// ----- FUNCIONES PARA CARDS / HANDLERS -----
function handleCardClick({ name, link }) {
  imagePopup.open({ name, link }); // PopupWithImage.open recibe {name, link} según tu implementación
}

// Devuelve función que togglea like a través del API y devuelve Promise con carta actualizada
function handleLikeToggle(cardId, isLiked) {
  // isLiked = boolean (si ya estaba like antes de click)
  if (isLiked) {
    return api.removeLike(cardId);
  } else {
    return api.addLike(cardId);
  }
}

// Abrir confirm y registrar la acción de borrado
function handleDeleteClick(cardInstance) {
  // cardInstance es la instancia de Card (tu Card pasa `this` cuando llama al handler)
  confirmPopup.setSubmitAction(() => {
    // debe devolver Promise
    return api.deleteCard(cardInstance._id).then(() => {
      cardInstance.removeCard(); // elimina del DOM
    });
  });
  confirmPopup.open();
}

function createCard(cardData) {
  const card = new Card({
    data: cardData,
    handleCardClick: (payload) => handleCardClick(payload),
    handleDeleteClick: (instance) => handleDeleteClick(instance),
    handleLikeToggle: (cardId, isLiked) => handleLikeToggle(cardId, isLiked),
    currentUserId,
    templateSelector: "#card-template",
  });

  return card.generateCard();
}

// ----- CARGA INICIAL (usuario + tarjetas) -----
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    currentUserId = userData._id;

    // Actualiza perfil en UI
    userInfo.setUserInfo({ name: userData.name, about: userData.about });
    userInfo.setUserAvatar(userData.avatar);

    // Render tarjetas (si quieres las últimas primero: reverse())
    initialCards.reverse().forEach((cardData) => {
      const cardEl = createCard(cardData);
      cardsContainer.append(cardEl);
    });
  })
  .catch((err) => {
    console.error("Error cargando datos iniciales:", err);
  });

// ----- EVENTOS UI -----
// Editar perfil
profileEditBtn.addEventListener("click", () => {
  const { name, about } = userInfo.getUserInfo(); // espera que UserInfo tenga getUserInfo()
  nameInput.value = name || "";
  jobInput.value = about || "";
  profileValidator.resetValidation();
  profilePopup.open();
});

// Cerrar profile popup con su botón si lo deseas (o utiliza PopupWithForm.close dentro)
profileCloseBtn.addEventListener("click", () => profilePopup.close());

// Añadir tarjeta
addCardBtn.addEventListener("click", () => {
  cardValidator.resetValidation();
  addCardPopup.open();
});

// Avatar editar: botón que debes añadir en HTML (ver más abajo)
const avatarEditBtn = document.getElementById("edit-avatar");
if (avatarEditBtn) {
  avatarEditBtn.addEventListener("click", () => {
    if (avatarValidator) avatarValidator.resetValidation();
    avatarPopup.open();
  });
}
