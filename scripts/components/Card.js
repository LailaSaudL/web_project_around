export class Card {
  constructor({
    data,
    handleCardClick,
    handleDeleteClick,
    handleLikeToggle,
    currentUserId,
    templateSelector
  }) {
    this._name = data.name;
    this._link = data.link;
    this._cardId = data._id; // Usamos _cardId para coherencia con index.js
    this._ownerId = data.owner?._id || data.owner; // Algunos servidores devuelven solo el ID
    this._likes = data.likes || [];
    this._templateSelector = templateSelector;

    this._handleCardClick = handleCardClick;
    this._handleDeleteClick = handleDeleteClick;
    this._handleLikeToggle = handleLikeToggle;
    this._currentUserId = currentUserId;
  }

  // Clonar la plantilla de tarjeta
  _getTemplate() {
    const cardTemplate = document.querySelector(this._templateSelector).content.querySelector(".card");
    return cardTemplate.cloneNode(true);
  }

  // Añadir todos los event listeners
  _setEventListeners() {
    this._likeButton = this._element.querySelector(".card__like-button");
    this._deleteButton = this._element.querySelector(".card__delete-button");
    this._image = this._element.querySelector(".card__image");

    // Evento de "me gusta"
    if (this._likeButton) {
      this._likeButton.addEventListener("click", () => this._handleLikeClick());
    }

    // Evento de eliminar tarjeta (solo si existe el botón)
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        this._handleDeleteClick(this);
      });
    }

    // Evento de ver imagen en grande
    if (this._image) {
      this._image.addEventListener("click", () => {
        this._handleCardClick({ name: this._name, link: this._link });
      });
    }
  }

  // Manejar clic en "me gusta"
  _handleLikeClick() {
    this._handleLikeToggle(this._cardId, this._isLiked())
      .then((updatedCard) => {
        this._likes = updatedCard.likes;
        this._updateLikeView();
      })
      .catch((err) => console.error("Error al alternar 'me gusta':", err));
  }

  // Verificar si el usuario ya dio "me gusta"
  _isLiked() {
    return this._likes.some((user) => user._id === this._currentUserId);
  }

  // Actualizar el estado visual del botón "me gusta"
  _updateLikeView() {
    if (this._likeButton) {
      if (this._isLiked()) {
        this._likeButton.classList.add("card__like-button_active");
      } else {
        this._likeButton.classList.remove("card__like-button_active");
      }
    }

    // Si existe un contador de likes en el HTML (opcional)
    const likeCounter = this._element.querySelector(".card__like-count");
    if (likeCounter) {
      likeCounter.textContent = this._likes.length;
    }
  }

  // Eliminar la tarjeta del DOM
  removeCard() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  // Crear la tarjeta completa
  generateCard() {
    this._element = this._getTemplate();

    // Asignar datos
    const titleElement = this._element.querySelector(".card__title");
    const imageElement = this._element.querySelector(".card__image");

    if (titleElement) titleElement.textContent = this._name;
    if (imageElement) {
      imageElement.src = this._link;
      imageElement.alt = this._name;
    }

    // Mostrar botón de eliminar solo si el usuario es el propietario
    if (this._ownerId !== this._currentUserId) {
      const deleteBtn = this._element.querySelector(".card__delete-button");
      if (deleteBtn) deleteBtn.remove();
    }

    // Configurar listeners y estado visual
    this._setEventListeners();
    this._updateLikeView();

    return this._element;
  }
}
