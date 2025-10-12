import { Popup } from "./Popup.js";

/**
 * Popup con confirmación (botón Sí / submit)
 * Se utiliza así:
 *  const confirmPopup = new PopupWithConfirmation("#confirm-popup");
 *  confirmPopup.setSubmitAction(() => api.deleteCard(id)); // debe devolver Promise
 *  confirmPopup.setEventListeners();
 *  confirmPopup.open();
 */
export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup ? this._popup.querySelector(".popup__form") : null;
    // función a ejecutar al confirmar (debe devolver Promise)
    this._submitHandler = null;
    this._onSubmit = this._onSubmit.bind(this);
  }

  // set la acción que se ejecutará cuando el usuario confirme
  setSubmitAction(action) {
    if (typeof action !== "function") {
      this._submitHandler = null;
    } else {
      this._submitHandler = action;
    }
  }

  // handler interno (ata al submit del form)
  _onSubmit(evt) {
    evt.preventDefault();
    if (!this._submitHandler) {
      return;
    }

    // Ejecutamos la acción, que debe devolver Promise.
    // Si devuelve algo que no es Promise, lo envolvemos en Promise.resolve.
    return Promise.resolve()
      .then(() => this._submitHandler())
      .then(() => {
        // cerrar popup si la acción Promise se resolvió
        this.close();
      })
      .catch((err) => {
        console.error("Error en acción de confirmación:", err);
        throw err;
      });
  }

  // agregar listeners (incluye listener del form)
  setEventListeners() {
    super.setEventListeners();
    if (this._form) {
      this._form.addEventListener("submit", this._onSubmit);
    }
  }
}
