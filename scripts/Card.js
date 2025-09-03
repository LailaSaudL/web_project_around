// Card.js
export class Card {
  constructor(data, templateSelector, handleCardClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
  }

  _getTemplate() {
    const cardElement = document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardElement;
  }

  _setEventListeners() {
    this._element.querySelector(".card__like-button").addEventListener("click", () => {
      this._handleLike();
    });
    this._element.querySelector(".card__delete-button").addEventListener("click", () => {
      this._element.remove();
    });
    this._element.querySelector(".card__image").addEventListener("click", () => {
      this._handleCardClick(this._name, this._link);
    });
  }

  _handleLike() {
    this._element.querySelector(".card__like-button").classList.toggle("card__like-button_active");
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    const cardImage = this._element.querySelector(".card__image");
    cardImage.src = this._link;
    cardImage.alt = this._name;

    this._setEventListeners();
    return this._element;
  }
}
