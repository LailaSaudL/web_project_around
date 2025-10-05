import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit, resetValidation) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup ? this._popup.querySelector(".popup__form") : null;
    this._inputList = this._form ? Array.from(this._form.querySelectorAll(".popup__input")) : [];
    this._submitButton = this._form ? this._form.querySelector(".popup__button") : null;
    this._submitBtnInitialText = this._submitButton ? this._submitButton.textContent : "";
    this._resetValidation = resetValidation; // opcional: función para resetear validación al abrir/cerrar
    this._onSubmit = this._onSubmit.bind(this);
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach(input => {
      values[input.name || input.id] = input.value;
    });
    return values;
  }

  _onSubmit(evt) {
    evt.preventDefault();
    if (!this._submitButton) return;
    this._renderLoading(true);
    return this._handleFormSubmit(this._getInputValues())
      .then(() => this.close())
      .catch(err => console.error(err))
      .finally(() => this._renderLoading(false));
  }

  setEventListeners() {
    super.setEventListeners();
    if (this._form) this._form.addEventListener("submit", this._onSubmit);
  }

  _renderLoading(isLoading, loadingText = "Guardando...") {
    if (!this._submitButton) return;
    if (isLoading) {
      this._submitButton.dataset.originalText = this._submitButton.textContent;
      this._submitButton.textContent = loadingText;
    } else {
      this._submitButton.textContent = this._submitButton.dataset.originalText || this._submitBtnInitialText;
    }
  }

  open() {
    super.open();
    if (typeof this._resetValidation === "function") {
      this._resetValidation(this._form);
    }
  }

  close() {
    super.close();
    if (this._form) this._form.reset();
  }
}
