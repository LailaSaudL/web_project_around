export class Card {
  constructor({ data, handleCardClick, handleDeleteClick, handleLikeToggle, currentUserId, templateSelector }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;               
    this._ownerId = data.owner?._id;    // owner del servidor
    this._likes = data.likes || [];
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeToggle = handleLikeToggle;
    this._currentUserId = currentUserId;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content
      .querySelector(".card")
      .cloneNode(true);
  }

  _setEventListeners() {
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");
    this._image = this._element.querySelector(".card__image");

    this._likeButton.addEventListener("click", () => this._handleLikeClick());

    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this);
      });
    }

    this._image.addEventListener("click", () => {
      this._handleCardClick({ name: this._name, link: this._link });
    });
  }

  _handleLikeClick() {
    this._handleLikeToggle(this._id, this._isLiked())
      .then((updatedCard) => {
        this._likes = updatedCard.likes;
        this._updateLikeView();
      })
      .catch(err => console.error(err));
  }

  _isLiked() {
    return this._likes.some(user => user._id === this._currentUserId);
  }

  _updateLikeView() {
    if (this._isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }

    // si quieres contador → asegúrate de tener <span class="card__like-count"></span> en el template
    const counter = this._element.querySelector(".card__like-count");
    if (counter) counter.textContent = this._likes.length;
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  generateCard() {
    this._element = this._getTemplate();
    this._element.querySelector(".card__title").textContent = this._name;
    const img = this._element.querySelector(".card__image");
    img.src = this._link;
    img.alt = this._name;

    // mostrar trash solo si es dueño
    if (this._ownerId !== this._currentUserId) {
      const btn = this._element.querySelector(".card__delete-button");
      if (btn) btn.remove();
    }

    this._setEventListeners();
    this._updateLikeView();

    return this._element;
  }
}
