import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector("form");
    this._submitHandler = null;
  }

  setSubmitAction(action) {
    // action: () => Promise
    this._submitHandler = action;
  }

  _handleSubmit = (evt) => {
    evt.preventDefault();
    if (!this._submitHandler) return;
    this._submitHandler()
      .then(() => this.close())
      .catch(err => console.error(err));
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", this._handleSubmit);
  }
}
