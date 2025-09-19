import { Popup } from './Popup.js';

export class PopupWithImage extends Popup {
  constructor(popupSelector) {
    super(popupSelector);
    this._image = this.popup.querySelector('.popup__img');
    this._caption = this.popup.querySelector('.popup__img-title');
  }

  open(name, link) {
    if (this._image) {
      this._image.src = link;
      this._image.alt = name;
    }
    if (this._caption) this._caption.textContent = name;
    super.open();
  }
}
