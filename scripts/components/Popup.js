export class Popup {
  constructor(popupSelector) {
    this._popup =
      typeof popupSelector === "string"
        ? document.querySelector(popupSelector)
        : popupSelector;
    this._handleEscClose = this._handleEscClose.bind(this);
    this._isEscListening = false; // para evitar listeners duplicados
  }

  open() {
    if (!this._popup) return;

    // Abrir según tipo
    if (this._popup.tagName === "DIALOG") {
      if (typeof this._popup.showModal === "function") {
        this._popup.showModal();
        // Algunos navegadores requieren focus para captar el "Escape"
        this._popup.focus();
      } else {
        this._popup.classList.add("popup_opened");
      }
    } else {
      this._popup.classList.add("popup_opened");
    }

    if (!this._isEscListening) {
      document.addEventListener("keydown", this._handleEscClose);
      this._isEscListening = true;
    }
  }

  close() {
    if (!this._popup) return;

    if (this._popup.tagName === "DIALOG") {
      this._popup.close();
    } else {
      this._popup.classList.remove("popup_opened");
    }

    if (this._isEscListening) {
      document.removeEventListener("keydown", this._handleEscClose);
      this._isEscListening = false;
    }
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    if (!this._popup) return;

    // Cierre por botón
    const closeBtns = Array.from(
      this._popup.querySelectorAll(".popup__button_close, .popup__exit")
    );
    closeBtns.forEach((btn) =>
      btn.addEventListener("click", () => this.close())
    );

    // Cierre por clic en overlay
    this._popup.addEventListener("click", (evt) => {
      // Evita cerrar si se hace clic dentro del contenido del popup
      const container = this._popup.querySelector(".popup__container");
      if (evt.target === this._popup && !container.contains(evt.target)) {
        this.close();
      }
      // Para <dialog> también aplica cuando se hace clic fuera
      if (evt.target === this._popup && this._popup.tagName === "DIALOG") {
        this.close();
      }
    });
  }
}
