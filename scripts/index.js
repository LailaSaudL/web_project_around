import { api } from "./Api.js";
import { Card } from "./components/Card.js";
import { PopupWithImage } from "./components/PopupWithImage.js";
import { PopupWithForm } from "./components/PopupWithForm.js";
import { PopupWithConfirmation } from "./components/PopupWithConfirmation.js";
import { UserInfo } from "./components/UserInfo.js";
import { FormValidator } from "./FormValidator.js";

// ----- SELECTORES -----
const profileEditBtn = document.getElementById("edit-button");
const addCardBtn = document.getElementById("add-card");
const avatarEditBtn = document.getElementById("edit-avatar");

const profileForm = document.getElementById("profile-form");
const cardForm = document.getElementById("card-form");
const avatarForm = document.getElementById("avatar-form");

const nameInput = document.getElementById("name-profile");
const jobInput = document.getElementById("job-profile");

const cardsContainer = document.getElementById("cards-container");

let currentUserId = null;

// ----- INSTANCIAS -----
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  aboutSelector: ".profile__text",
  avatarSelector: ".profile__avatar",
});

// Popups -----
const imagePopup = new PopupWithImage("#popup-image");
imagePopup.setEventListeners();

const confirmPopup = new PopupWithConfirmation("#confirm-popup");
confirmPopup.setEventListeners();

const profilePopup = new PopupWithForm("#profile-popup", (formValues) => {
  return api
    .setUserInfo({ name: formValues.name, about: formValues.about })
    .then((updatedUser) => {
      userInfo.setUserInfo({
        name: updatedUser.name,
        about: updatedUser.about,
      });
    });
});
profilePopup.setEventListeners();

const addCardPopup = new PopupWithForm("#card-popup", (formValues) => {
  return api
    .addCard({ name: formValues.name, link: formValues.link })
    .then((newCard) => {
      const cardEl = createCard(newCard);
      cardsContainer.prepend(cardEl);
    });
});
addCardPopup.setEventListeners();

const avatarPopup = new PopupWithForm("#avatar-popup", (formValues) => {
  return api
    .updateAvatar({ avatar: formValues.avatar })
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
const avatarValidator = new FormValidator(validationConfig, avatarForm);
avatarValidator.enableValidation();

// ----- FUNCIONES -----
function handleCardClick({ name, link }) {
  imagePopup.open({ name, link });
}

function handleLikeToggle(cardId, isLiked) {
  return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
}

function handleDeleteClick(cardInstance) {
  confirmPopup.setSubmitAction(() => {
    return api.deleteCard(cardInstance._id).then(() => {
      cardInstance.removeCard();
    });
  });
  confirmPopup.open();
}

function createCard(cardData) {
  const card = new Card({
    data: cardData,
    handleCardClick,
    handleDeleteClick,
    handleLikeToggle,
    currentUserId,
    templateSelector: "#card-template",
  });
  return card.generateCard();
}

// ----- CARGA INICIAL -----
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    currentUserId = userData._id;
    userInfo.setUserInfo({
      name: userData.name,
      about: userData.about,
    });
    userInfo.setUserAvatar(userData.avatar);

    initialCards.reverse().forEach((card) => {
      const cardEl = createCard(card);
      cardsContainer.append(cardEl);
    });
  })
  .catch((err) => console.error("Error inicial:", err));

// ----- EVENTOS -----
profileEditBtn.addEventListener("click", () => {
  const { name, about } = userInfo.getUserInfo();
  nameInput.value = name || "";
  jobInput.value = about || "";
  profileValidator.resetValidation();
  profilePopup.open();
});

addCardBtn.addEventListener("click", () => {
  cardValidator.resetValidation();
  addCardPopup.open();
});

avatarEditBtn.addEventListener("click", () => {
  avatarValidator.resetValidation();
  avatarPopup.open();
});
