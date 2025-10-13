export class Card {
  constructor({ data, handleCardClick, handleDeleteClick, handleLikeToggle, currentUserId, templateSelector }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._ownerId = data.owner && (data.owner._id || data.owner);
    this._likes = Array.isArray(data.likes) ? data.likes : [];
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeToggle = handleLikeToggle;
    this._currentUserId = currentUserId;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    if (!template) {
      throw new Error(`Template not found: ${this._templateSelector}`);
    }
    return template.content.querySelector(".card").cloneNode(true);
  }

  _setEventListeners() {
    if (this._likeButton) {
      this._likeButton.addEventListener("click", () => this._handleLikeClick());
    }
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => this._handleDeleteClick(this));
    }
    if (this._image) {
      this._image.addEventListener("click", () => this._handleCardClick({ name: this._name, link: this._link }));
    }
  }

  // like toggle
  _handleLikeClick() {
    if (typeof this._handleLikeToggle !== "function") {
      console.warn("No handleLikeToggle for card:", this._id);
      return;
    }

    const currentlyLiked = this._isLiked();
    console.log("Like click -> cardId:", this._id, "isLiked:", currentlyLiked);

    // disable to prevent double click
    if (this._likeButton) this._likeButton.disabled = true;

    this._handleLikeToggle(this._id, currentlyLiked)
      .then((updatedCard) => {
        if (updatedCard && Array.isArray(updatedCard.likes)) {
          this._likes = updatedCard.likes;
        } else {
          // fallback if API doesn’t send likes
          if (currentlyLiked) {
            this._likes = this._likes.filter((u) => u._id !== this._currentUserId);
          } else {
            this._likes.push({ _id: this._currentUserId });
          }
        }
        this._updateLikeView();
      })
      .catch((err) => console.error("Like error:", err))
      .finally(() => {
        if (this._likeButton) this._likeButton.disabled = false;
      });
  }

  _isLiked() {
    if (!Array.isArray(this._likes)) return false;
    return this._likes.some((user) => user._id === this._currentUserId);
  }

  _updateLikeView() {
    if (!this._likeButton || !this._likeCount) return;

    this._likeCount.textContent = Array.isArray(this._likes) ? this._likes.length : 0;

    if (this._isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  removeCard() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  generateCard() {
    this._element = this._getTemplate();

    this._title = this._element.querySelector(".card__title");
    this._image = this._element.querySelector(".card__image");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._likeCount = this._element.querySelector(".card__like-count");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    if (this._title) this._title.textContent = this._name;
    if (this._image) {
      this._image.src = this._link;
      this._image.alt = this._name;
    }

    // hide delete if not owner
    if (this._deleteButton && this._ownerId !== this._currentUserId) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    this._updateLikeView();
    this._setEventListeners();

    return this._element;
  }
}
