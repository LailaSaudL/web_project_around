// scripts/index.js
import { FormValidator } from "./FormValidator.js";
import { Card } from "./components/Card.js";
import { Section } from "./components/Section.js";
import { UserInfo } from "./components/UserInfo.js";
import { PopupWithForm } from "./components/PopupWithForm.js";
import { PopupWithImage } from "./components/PopupWithImage.js";
import { PopupWithConfirmation } from "./components/PopupWithConfirmation.js";
import { api } from "./Api.js";

// --------- CONFIG ---------
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// --------- ELEMENTOS ---------
const profilePopupSelector = "#profile-popup";
const cardPopupSelector = "#card-popup";
const avatarPopupSelector = "#avatar-popup";
const confirmPopupSelector = "#confirm-popup";
const imagePopupSelector = "#popup-image";

const profileForm = document.querySelector("#profile-form");
const cardForm = document.querySelector("#card-form");
const avatarForm = document.querySelector("#avatar-form");

const editButton = document.querySelector("#edit-button");
const addCardButton = document.querySelector("#add-card");
const avatarButton = document.querySelector("#avatar-button");

// --------- INSTANCIAS ---------
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  aboutSelector: ".profile__text",
  avatarSelector: ".profile__avatar",
});

let currentUserId;

// Popup imagen
const popupWithImage = new PopupWithImage(imagePopupSelector);
popupWithImage.setEventListeners();

// Popup confirmar
const popupWithConfirm = new PopupWithConfirmation(confirmPopupSelector);
popupWithConfirm.setEventListeners();

// Section de tarjetas
const cardSection = new Section(
  (item) => {
    const cardElement = createCard(item);
    cardSection.addItem(cardElement);
  },
  "#cards-container"
);

// --------- FUNCIONES ---------
function createCard(data) {
  const card = new Card({
    data,
    currentUserId,
    templateSelector: "#card-template",
    handleCardClick: ({ name, link }) => popupWithImage.open(name, link),
    handleDeleteClick: (cardInstance) => {
      popupWithConfirm.open();
      popupWithConfirm.setSubmitAction(() =>
        api.deleteCard(cardInstance._id).then(() => {
          cardInstance.removeCard();
        })
      );
    },
    handleLikeToggle: (cardId, isLiked) => {
      return isLiked ? api.removeLike(cardId) : api.addLike(cardId);
    },
  });
  return card.generateCard();
}

// --------- POPUPS DE FORM ---------
const popupEditProfile = new PopupWithForm(profilePopupSelector, (formData) => {
  return api.setUserInfo({ name: formData["name-profile"], about: formData["job-profile"] })
    .then((res) => {
      userInfo.setUserInfo({ name: res.name, about: res.about, avatar: res.avatar });
    });
});
popupEditProfile.setEventListeners();

const popupAddCard = new PopupWithForm(cardPopupSelector, (formData) => {
  return api.addCard({ name: formData["card-title"], link: formData["card-url"] })
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
    });
});
popupAddCard.setEventListeners();

const popupUpdateAvatar = new PopupWithForm(avatarPopupSelector, (formData) => {
  return api.updateAvatar({ avatar: formData["avatar-url"] })
    .then((res) => {
      userInfo.setUserInfo({ name: res.name, about: res.about, avatar: res.avatar });
    });
});
popupUpdateAvatar.setEventListeners();

// --------- VALIDADORES ---------
const profileValidator = new FormValidator(validationConfig, profileForm);
profileValidator.enableValidation();

const cardValidator = new FormValidator(validationConfig, cardForm);
cardValidator.enableValidation();

const avatarValidator = new FormValidator(validationConfig, avatarForm);
avatarValidator.enableValidation();

// --------- EVENTOS DE BOTONES ---------
editButton.addEventListener("click", () => {
  const { name, about } = userInfo.getUserInfo();
  profileForm.querySelector("#name-profile").value = name;
  profileForm.querySelector("#job-profile").value = about;
  profileValidator.resetValidation();
  popupEditProfile.open();
});

addCardButton.addEventListener("click", () => {
  cardValidator.resetValidation();
  popupAddCard.open();
});

avatarButton.addEventListener("click", () => {
  avatarValidator.resetValidation();
  popupUpdateAvatar.open();
});

// --------- CARGA INICIAL ---------
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, initialCards]) => {
    currentUserId = userData._id;
    userInfo.setUserInfo({ name: userData.name, about: userData.about, avatar: userData.avatar });
    cardSection.renderItems(initialCards);
  })
  .catch((err) => console.error(err));
