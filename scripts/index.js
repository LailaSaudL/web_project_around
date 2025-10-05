import { FormValidator } from "./FormValidator.js";
import { Card } from "./Card.js";
import { PopupWithImage } from "./components/PopupWithImage.js";
import { PopupWithForm } from "./components/PopupWithForm.js";
import { UserInfo } from "./components/UserInfo.js";
import { Section } from "./components/Section.js";

// ---------- Configuración ----------
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

const cardTemplateSelector = "#card-template";
const cardsContainerSelector = "#cards-container";

// ---------- Instancias ----------
const userInfo = new UserInfo({
  nameSelector: ".profile__name",
  jobSelector: ".profile__text"
});

const popupWithImage = new PopupWithImage("#popup-image");
popupWithImage.setEventListeners();

// Generador de tarjetas
function createCard(data) {
  const card = new Card({
    data,
    currentUserId: userId,
    templateSelector: "#card-template",
    handleCardClick: ({ name, link }) => popupWithImage.open(name, link),
    handleDeleteClick: (cardInstance) => {
      popupWithConfirmation.setSubmitAction(() => {
        return api.deleteCard(cardInstance._id)
          .then(() => {
            cardInstance.removeCard();
          });
      });
      popupWithConfirmation.open();
    },
    handleLikeToggle: (cardId, isLiked) => {
      if (isLiked) {
        return api.removeLike(cardId);
      } else {
        return api.addLike(cardId);
      }
    }
  });
  return card.generateCard();
}

// Sección de tarjetas iniciales
const initialCards = [
  { name: "Valle de Yosemite", link: "images/valledeyosemite.png" },
  { name: "Lago Louise", link: "images/lagolouise.png" }
  // ... más si quieres
];

const cardSection = new Section(
  { items: initialCards, renderer: (item) => cardSection.addItem(createCard(item), false) },
  cardsContainerSelector
);
cardSection.renderItems();

// Popup editar perfil
const popupProfile = new PopupWithForm("#profile-popup", (formData, popup) => {
  userInfo.setUserInfo({
    name: formData["name-profile"],
    job: formData["job-profile"]
  });
  popup.close();
});
popupProfile.setEventListeners();

// Popup nueva tarjeta
const popupCard = new PopupWithForm("#card-popup", (formData, popup) => {
  const newCard = createCard({
    name: formData["card-title"],
    link: formData["card-url"]
  });
  cardSection.addItem(newCard, true); // prepend
  popup.close();
});
popupCard.setEventListeners();

// ---------- Botones de apertura ----------
document.getElementById("edit-button").addEventListener("click", () => {
  const { name, job } = userInfo.getUserInfo();
  document.getElementById("name-profile").value = name;
  document.getElementById("job-profile").value = job;
  popupProfile.open();
});

document.getElementById("add-card").addEventListener("click", () => {
  popupCard.open();
});

const popupWithConfirmation = new PopupWithConfirmation("#popup-confirm");
popupWithConfirmation.setEventListeners();

// ---------- Validación ----------
new FormValidator(validationConfig, document.querySelector("#profile-form")).enableValidation();
new FormValidator(validationConfig, document.querySelector("#card-form")).enableValidation();

