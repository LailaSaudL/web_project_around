import { Popup } from "./Popup.js";

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._popupImage = this._popup?.querySelector(".popup__img");
    this._popupTitle = this._popup?.querySelector(".popup__img-title");
  }

  open({ name, link }) {
    if (!this._popup) {
      console.error("Popup no encontrado:", this._popup);
      return;
    }

    if (!this._popupImage || !this._popupTitle) {
      console.error("Elementos .popup__img o .popup__img-title no encontrados dentro del popup.");
      return;
    }

    this._popupImage.src = link;
    this._popupImage.alt = name;
    this._popupTitle.textContent = name;

    super.open();
  }
}
