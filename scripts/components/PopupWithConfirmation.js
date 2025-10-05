import { Popup } from "./Popup.js";

export class PopupWithConfirmation extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._form = this._popup.querySelector(".popup__form");
  }

  setSubmitAction(action) {
    this._submitHandler = action;
  }

  setEventListeners() {
    super.setEventListeners();
    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (this._submitHandler) {
        this._submitHandler()
          .then(() => this.close())
          .catch(err => console.error(err));
      }
    });
  }
}
