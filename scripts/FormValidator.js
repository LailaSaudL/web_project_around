export class FormValidator {
  constructor(config, formElement) {
    this._config = config;
    this._formElement = formElement;
    if (!this._formElement) {
      // Protección por si llaman al validador sin form
      throw new Error("FormValidator: formElement no puede ser null/undefined");
    }
    this._inputList = Array.from(this._formElement.querySelectorAll(this._config.inputSelector));
    this._buttonElement = this._formElement.querySelector(this._config.submitButtonSelector);
  }

  // Mostrar message de error para un input
  _showInputError(inputElement, message) {
    const errorElement = this._formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) return;
    inputElement.classList.add(this._config.inputErrorClass);
    errorElement.textContent = message;
    errorElement.classList.add(this._config.errorClass);
  }

  // Ocultar message de error
  _hideInputError(inputElement) {
    const errorElement = this._formElement.querySelector(`#${inputElement.id}-error`);
    if (!errorElement) return;
    inputElement.classList.remove(this._config.inputErrorClass);
    errorElement.textContent = "";
    errorElement.classList.remove(this._config.errorClass);
  }

  // Comprueba un input y muestra/oculta error (usa mensaje por defecto del navegador)
  _checkInputValidity(inputElement) {
    if (!inputElement.validity.valid) {
      this._showInputError(inputElement, inputElement.validationMessage);
    } else {
      this._hideInputError(inputElement);
    }
  }

  _hasInvalidInput() {
    return this._inputList.some(input => !input.validity.valid);
  }

  // Cambia estado del botón (habilitado / deshabilitado)
  _toggleButtonState() {
    if (!this._buttonElement) return;
    if (this._hasInvalidInput()) {
      this._buttonElement.classList.add(this._config.inactiveButtonClass);
      this._buttonElement.disabled = true;
    } else {
      this._buttonElement.classList.remove(this._config.inactiveButtonClass);
      this._buttonElement.disabled = false;
    }
  }

  // Asigna listeners a inputs
  _setEventListeners() {
    this._toggleButtonState(); // estado inicial

    this._inputList.forEach(inputElement => {
      inputElement.addEventListener("input", () => {
        this._checkInputValidity(inputElement);
        this._toggleButtonState();
      });
    });
  }

  // Público: activa validación en el form
  enableValidation() {
    // Previene envío real para permitir manejo con JS (si no quieres, quitar)
    this._formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    this._setEventListeners();
  }

  // Público: restablece el form (oculta errores, ajusta botón)
  resetValidation() {
    this._inputList.forEach(inputElement => this._hideInputError(inputElement));
    this._toggleButtonState();
  }
}
