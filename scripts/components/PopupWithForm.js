// /scripts/components/PopupWithForm.js
import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector(".popup__form");
    this._inputList = Array.from(this._form.querySelectorAll(".popup__input"));
    this._submitButton = this._form.querySelector(".popup__button");
    this._submitBtnInitialText = this._submitButton.textContent;
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name] = input.value; // usa "name" en vez de id para consistencia
    });
    return values;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._renderLoading(true);
      this._handleFormSubmit(this._getInputValues())
        .then(() => this.close())
        .catch((err) => console.error(err))
        .finally(() => this._renderLoading(false));
    });
  }

  _renderLoading(isLoading, loadingText = "Guardando...") {
    if (isLoading) {
      this._submitButton.textContent = loadingText;
    } else {
      this._submitButton.textContent = this._submitBtnInitialText;
    }
  }

  close() {
    super.close();
    this._form.reset();
  }
}

//Actualizar foto de perfil
const avatarPopup = new PopupWithForm("#popup-avatar", (formValues) => {
  return api.updateAvatar({ avatar: formValues.avatar })
    .then((userData) => {
      userInfo.setUserInfo({
        name: userData.name,
        about: userData.about,
        avatar: userData.avatar
      });
    });
});
avatarPopup.setEventListeners();

// abrir
document.querySelector("#edit-avatar-button").addEventListener("click", () => {
  avatarPopup.open();
});

