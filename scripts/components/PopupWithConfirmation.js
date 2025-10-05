import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup ? this._popup.querySelector("form") : null;
    this._submitHandler = null;
    this._handleSubmit = this._handleSubmit.bind(this);
  }

setSubmitAction(action) {
  this._handleSubmit = action;
}

  _handleSubmit(evt) {
    evt.preventDefault();
    if (this._handleSubmit) {
  this._handleSubmit();
}

  setEventListeners() {
    super.setEventListeners();
    if (this._form) {
      this._form.addEventListener("submit", this._handleSubmit);
    }
  }
}
