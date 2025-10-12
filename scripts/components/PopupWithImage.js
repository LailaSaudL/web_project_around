import { Popup } from "./Popup.js";

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupImage = this._popup.querySelector(".popup__img");
    this._popupTitle = this._popup.querySelector(".popup__img-title");
  }

  open({ name, link }) {
    if (!this._popupImage || !this._popupTitle) {
      console.error("Error: elementos de imagen o título no encontrados en el popup");
      return;
    }
    this._popupImage.src = link;
    this._popupImage.alt = name;
    this._popupTitle.textContent = name;
    super.open();
  }
}
