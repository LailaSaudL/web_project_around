import { Popup } from './Popup.js';

export class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this.popup.querySelector('.popup__form');
    this._inputList = Array.from(this._form ? this._form.querySelectorAll('.popup__input') : []);
    this._submitButton = this._form ? this._form.querySelector('.popup__button') : null;
    this._onSubmit = this._onSubmit.bind(this);
  }

  _getInputValues() {
    const values = {};
    this._inputList.forEach(input => {
      values[input.id || input.name] = input.value;
    });
    return values;
  }

  _onSubmit(evt) {
    evt.preventDefault();
    this._handleFormSubmit(this._getInputValues(), this);
  }

  setEventListeners() {
    super.setEventListeners();
    if (this._form) this._form.addEventListener('submit', this._onSubmit);
  }

  close() {
    super.close();
    if (this._form) this._form.reset();
  }
}


// dentro de PopupWithForm class
open() {
  super.open();
  // (opcional) resetValidation aquí
}

setEventListeners() {
  super.setEventListeners();
  this._form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const submitBtn = this._form.querySelector("button[type='submit']");
    const initialText = submitBtn.textContent;
    submitBtn.textContent = "Guardando...";
    // execute external handler which should return a Promise
    this._handleFormSubmit(this._getInputValues())
      .then(() => {
        this.close();
      })
      .catch(err => console.error(err))
      .finally(() => {
        submitBtn.textContent = initialText;
      });
  });
}
