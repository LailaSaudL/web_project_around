export class Card {
  constructor({ data, handleCardClick, handleDeleteClick, handleLikeToggle, currentUserId, templateSelector }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._ownerId = data.owner?._id;
    this._likes = data.likes || [];
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeToggle = handleLikeToggle;
    this._currentUserId = currentUserId;
  }

  _getTemplate() {
    const cardTemplate = document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    return cardTemplate;
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
    const likeCount = this._element.querySelector(".card__like-count");
    if (likeCount) likeCount.textContent = this._likes.length;
  }

  _handleLikeClick() {
    this._handleLikeToggle(this._id, this._isLiked())
      .then(updatedCard => {
        this._likes = updatedCard.likes;
        this._updateLikeView();
      })
      .catch(err => console.error("Error al cambiar like:", err));
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => this._handleLikeClick());
    this._deleteButton.addEventListener("click", () => this._handleDeleteClick(this));
    this._image.addEventListener("click", () => this._handleCardClick({ name: this._name, link: this._link }));
  }

  removeCard() {
    this._element.remove();
    this._element = null;
  }

  generateCard() {
    this._element = this._getTemplate();
    this._image = this._element.querySelector(".card__image");
    this._title = this._element.querySelector(".card__title");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    this._image.src = this._link;
    this._image.alt = this._name;
    this._title.textContent = this._name;

    if (this._ownerId !== this._currentUserId) {
      this._deleteButton.remove();
    }

    this._updateLikeView();
    this._setEventListeners();
    return this._element;
  }
}
