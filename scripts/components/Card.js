export class Card {
  constructor({ data, handleCardClick, handleDeleteClick, handleLikeToggle, currentUserId, templateSelector }) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    // owner puede venir como objeto o id, normalizamos
    this._ownerId = data.owner && (data.owner._id || data.owner);
    // siempre garantizamos un array
    this._likes = Array.isArray(data.likes) ? data.likes : [];
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeToggle = handleLikeToggle; // función que retorna Promise
    this._currentUserId = currentUserId;
  }

  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    if (!template) throw new Error(`Template no encontrado: ${this._templateSelector}`);
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

  _handleLikeClick() {
    // protección: si no hay handler, salir
    if (typeof this._handleLikeToggle !== "function") {
      console.warn("No hay handleLikeToggle registrado para esta carta:", this._id);
      return;
    }

    // protección: si no tenemos id, salir
    if (!this._id) {
      console.warn("Card sin id:", this);
      return;
    }

    // bloquear botón para evitar spam
    if (this._likeButton) this._likeButton.disabled = true;

    const currentlyLiked = this._isLiked();
    // Registrar en consola para depuración
    console.log("Like click -> cardId:", this._id, "isLiked:", currentlyLiked);

    // delegate to the provided function (should return a Promise resolving to updated card data)
_handleLikeClick() {
  if (typeof this._handleLikeToggle !== "function") {
    console.warn("No hay handleLikeToggle registrado para esta carta:", this._id);
    return;
  }

  if (!this._id) {
    console.warn("Card sin id:", this);
    return;
  }

  if (this._likeButton) this._likeButton.disabled = true;

  const currentlyLiked = this._isLiked();
  console.log("Like click -> cardId:", this._id, "isLiked:", currentlyLiked);

  this._handleLikeToggle(this._id, currentlyLiked)
    .then((updatedCard) => {
      // si el servidor no envía likes, conservar el estado anterior
      if (Array.isArray(updatedCard.likes)) {
        this._likes = updatedCard.likes;
      } else {
        // si no devuelve likes, alternar manualmente el estado local
        if (currentlyLiked) {
          this._likes = this._likes.filter((user) => user._id !== this._currentUserId);
        } else {
          this._likes.push({ _id: this._currentUserId });
        }
      }
      this._updateLikeView();
    })
    .catch((err) => console.error("Error al hacer like:", err))
    .finally(() => {
      if (this._likeButton) this._likeButton.disabled = false;
    });
}

  _isLiked() {
    // protección: si _likes no es array -> false
    if (!Array.isArray(this._likes)) return false;
    return this._likes.some((user) => user._id === this._currentUserId);
  }

  _updateLikeView() {
    if (!this._likeButton || !this._likeCount) return;

    if (this._isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }

    // contador seguro
    this._likeCount.textContent = Array.isArray(this._likes) ? this._likes.length : 0;
  }

  removeCard() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  generateCard() {
    this._element = this._getTemplate();

    // elementos
    this._title = this._element.querySelector(".card__title");
    this._image = this._element.querySelector(".card__image");
    this._likeButton = this._element.querySelector(".card__like-button");
    this._likeCount = this._element.querySelector(".card__like-count");
    this._deleteButton = this._element.querySelector(".card__delete-button");

    // contenido
    if (this._title) this._title.textContent = this._name;
    if (this._image) {
      this._image.src = this._link;
      this._image.alt = this._name;
    }

    // solo propietarios ven el delete button
    if (this._deleteButton && this._ownerId !== this._currentUserId) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    // vista inicial
    this._updateLikeView();
    this._setEventListeners();

    return this._element;
  }
}
