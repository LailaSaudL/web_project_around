export class Popup {
  constructor(popupSelector) {
    this.popup = typeof popupSelector === 'string'
      ? document.querySelector(popupSelector)
      : popupSelector;
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    if (!this.popup) return;
    if (this.popup.tagName === 'DIALOG') {
      this.popup.showModal();
    } else {
      this.popup.classList.add('popup_opened');
    }
    document.addEventListener('keydown', this._handleEscClose);
  }

  close() {
    if (!this.popup) return;
    if (this.popup.tagName === 'DIALOG') {
      this.popup.close();
    } else {
      this.popup.classList.remove('popup_opened');
    }
    document.removeEventListener('keydown', this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  setEventListeners() {
    if (!this.popup) return;
    // close button(s)
    const closeBtn = this.popup.querySelector('.popup__button_close, .popup__exit');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    // click overlay: if click target is popup root, close
    this.popup.addEventListener('click', (evt) => {
      if (evt.target === this.popup) this.close();
    });
  }
}

