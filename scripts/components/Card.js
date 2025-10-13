export class Card {
  constructor({ data, handleCardClick, handleDeleteClick, handleLikeToggle, currentUserId, templateSelector }) {
    // Datos de la tarjeta desde la API
    this._name = data.name;
    this._link = data.link;
    this._id = data._id; // id de la tarjeta en el servidor

    // owner puede venir como string id o como objeto { _id: ... }
    this._ownerId = data.owner && (data.owner._id || data.owner);

    // likes: siempre garantizamos un array (puede que la API no lo envíe)
    this._likes = Array.isArray(data.likes) ? data.likes : [];

    // handlers y configuración externa
    this._templateSelector = templateSelector;
    this._handleCardClick = handleCardClick;       // abrir imagen
    this._handleDeleteClick = handleDeleteClick;   // abrir confirm y eliminar
    this._handleLikeToggle = handleLikeToggle;     // función que hace PUT/DELETE y devuelve Promise(updatedCard)
    this._currentUserId = currentUserId;           // id del usuario actual (para saber si ya lo likeó)
  }

  // Extrae y clona template
  _getTemplate() {
    const template = document.querySelector(this._templateSelector);
    if (!template) {
      throw new Error(`Template no encontrado: ${this._templateSelector}`);
    }
    const element = template.content.querySelector(".card");
    if (!element) {
      throw new Error(`Dentro del template no existe un elemento con la clase .card`);
    }
    return element.cloneNode(true);
  }

  // Asigna listeners (solo una vez que los elementos existen)
  _setEventListeners() {
    if (this._likeButton) {
      this._likeButton.addEventListener("click", () => this._handleLikeClick());
    }
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        // enviar la instancia para que el confirmPopup pueda eliminar el DOM después de la API
        if (typeof this._handleDeleteClick === "function") {
          this._handleDeleteClick(this);
        } else {
          console.warn("handleDeleteClick no definido para card", this._id);
        }
      });
    }
    if (this._image) {
      this._image.addEventListener("click", () => {
        if (typeof this._handleCardClick === "function") {
          this._handleCardClick({ name: this._name, link: this._link });
        } else {
          console.warn("handleCardClick no definido para card", this._id);
        }
      });
    }
  }

  // Manejo del click en like -> delega a la función externa que hace la llamada API
  _handleLikeClick() {
    if (typeof this._handleLikeToggle !== "function") {
      console.warn("No hay handleLikeToggle para esta carta:", this._id);
      return;
    }
    if (!Array.isArray(updatedCard.likes)) {
  // Fallback manual si la API no devuelve likes
  if (currentlyLiked) {
    this._likes = this._likes.filter(u => u._id !== this._currentUserId);
  } else {
    this._likes.push({ _id: this._currentUserId });
  }
}
    if (!this._id) {
      console.warn("Carta sin id:", this);
      return;
    }

    // disable para evitar spam de clicks
    if (this._likeButton) this._likeButton.disabled = true;

    const currentlyLiked = this._isLiked();
    console.log("Like click -> cardId:", this._id, "isLiked:", currentlyLiked);

    // llamar la función externa (debe devolver Promise que resuelva en el card actualizado)
    this._handleLikeToggle(this._id, currentlyLiked)
      .then((updatedCard) => {
        // la API debería devolver el objeto de la carta con `likes` -> lo usamos
        if (updatedCard && Array.isArray(updatedCard.likes)) {
          this._likes = updatedCard.likes;
        } else {
          // fallback: si la API no devuelve likes, alternamos localmente
          if (currentlyLiked) {
            this._likes = this._likes.filter(u => u._id !== this._currentUserId);
          } else {
            this._likes.push({ _id: this._currentUserId });
          }
        }
        this._updateLikeView();
      })
      .catch((err) => {
        console.error("Error en like toggle:", err);
      })
      .finally(() => {
        if (this._likeButton) this._likeButton.disabled = false;
      });
  }

  // Comprueba si el usuario actual ya dio like a esta tarjeta
  _isLiked() {
    if (!Array.isArray(this._likes)) return false;
    return this._likes.some(user => user._id === this._currentUserId);
  }

  // Actualiza la vista del like: clase activa + contador
  _updateLikeView() {
    if (!this._likeButton || !this._likeCount) return;

    // contador seguro
    const count = Array.isArray(this._likes) ? this._likes.length : 0;
    this._likeCount.textContent = String(count);

    // clase visual
    if (this._isLiked()) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  // Elimina del DOM
  removeCard() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  // Rellena datos y devuelve el elemento DOM listo
  generateCard() {
    this._element = this._getTemplate();

    // seleccionar subelementos
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

    // Mostrar/ocultar papelera dependiendo del owner
    if (this._deleteButton && this._ownerId !== this._currentUserId) {
      this._deleteButton.remove();
      this._deleteButton = null;
    }

    // vista inicial y listeners
    this._updateLikeView();
    this._setEventListeners();

    return this._element;
  }
}
