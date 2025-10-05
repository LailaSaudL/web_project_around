export class Popup {
  constructor(popupSelector) {
    this._popup = typeof popupSelector === "string"
      ? document.querySelector(popupSelector)
      : popupSelector;
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    if (!this._popup) return;
    if (this._popup.tagName === "DIALOG") {
      this._popup.showModal();
    } else {
      this._popup.classList.add("popup_opened");
    }
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    if (!this._popup) return;
    if (this._popup.tagName === "DIALOG") {
      this._popup.close();
    } else {
      this._popup.classList.remove("popup_opened");
    }
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    if (!this._popup) return;
    // botones de cierre (puede haber más de uno)
    const closeBtns = Array.from(this._popup.querySelectorAll(".popup__button_close, .popup__exit"));
    closeBtns.forEach(btn => btn.addEventListener("click", () => this.close()));

    // click en overlay: si el target es el root (.popup) => cerrar
    this._popup.addEventListener("click", (evt) => {
      if (evt.target === this._popup) this.close();
    });
  }
}
