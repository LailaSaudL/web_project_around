import { Popup } from "./Popup.js";

export class PopupWithForm extends Popup {
  /**
   * @param {string} popupSelector - selector del popup
   * @param {function(Object): Promise} handleFormSubmit - función que recibe los valores del form y devuelve una Promise
   * @param {function(formElement):void} [resetValidation] - función opcional para restablecer validación al abrir
   */
  constructor(popupSelector, handleFormSubmit, resetValidation) {
    super(popupSelector);

    this._handleFormSubmit = handleFormSubmit;
    this._resetValidation = typeof resetValidation === "function" ? resetValidation : null;

    // elementos del form (si existen)
    this._form = this._popup ? this._popup.querySelector(".popup__form") : null;
    this._inputList = this._form ? Array.from(this._form.querySelectorAll(".popup__input")) : [];
    this._submitButton = this._form ? this._form.querySelector(".popup__button") : null;

    // guardar texto por defecto del submit (para restaurar después de "Guardando...")
    this._submitBtnInitialText = this._submitButton ? this._submitButton.textContent : "";

    // bind
    this._onSubmit = this._onSubmit.bind(this);
  }

  // recoge valores del form: usa name o id como clave
  _getInputValues() {
    const values = {};
    this._inputList.forEach((input) => {
      values[input.name || input.id] = input.value;
    });
    return values;
  }

  // handler del submit (atado al formulario)
  _onSubmit(evt) {
    evt.preventDefault();
    if (!this._form) return;

    // muestra estado de carga (cambia texto del botón)
    this._renderLoading(true);

    // ejecutar la función externa que debe devolver Promise
    const maybePromise = this._handleFormSubmit(this._getInputValues(), this);
    // Si la función no devuelve Promise, envolvemos en Promise.resolve
    return Promise.resolve(maybePromise)
      .then(() => {
        this.close();
      })
      .catch((err) => {
        // deja el error visible en consola; no cerramos el popup si falla
        console.error("Error en submit del popup:", err);
        throw err;
      })
      .finally(() => {
        // restaurar texto del botón
        this._renderLoading(false);
      });
  }

  // atar eventos (incluye submit)
  setEventListeners() {
    super.setEventListeners();
    if (this._form) {
      this._form.addEventListener("submit", this._onSubmit);
    }
  }

  // mostrar texto "guardando..." y restaurar
  _renderLoading(isLoading, loadingText = "Guardando...") {
    if (!this._submitButton) return;
    if (isLoading) {
      // almacenamos en dataset para restaurar si hiciera falta
      this._submitButton.dataset.originalText = this._submitButton.textContent;
      this._submitButton.textContent = loadingText;
      this._submitButton.disabled = true;
    } else {
      const original = this._submitButton.dataset.originalText || this._submitBtnInitialText;
      this._submitButton.textContent = original;
      this._submitButton.disabled = false;
      // opcional: eliminar la marca dataset
      delete this._submitButton.dataset.originalText;
    }
  }

  // abrir: invoca resetValidation (si está disponible) y luego super.open()
  open() {
    if (this._resetValidation && this._form) {
      try {
        this._resetValidation(this._form);
      } catch (err) {
        // no detener si la función externa falla
        console.warn("resetValidation falló:", err);
      }
    }
    super.open();
  }

  // cerrar: delega a super y remueve/limpia el form
  close() {
    super.close();
    if (this._form) {
      this._form.reset();
    }
  }
}
