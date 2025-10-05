export default class Card {
    constructor({name, link, cardId}, templateSelector, handleCardClick, handleDeleteClick) {
        this._name = name;
        this._link = link;
        this._cardId = cardId;
        this._templateSelector = templateSelector;
        this._handleCardClick = handleCardClick;
        this._handleDeleteClick = handleDeleteClick;
    }

    _getTemplate() {
        const cardElement = document
        .querySelector(this._templateSelector)
        .content.querySelector(".main__gallery-card")
        .cloneNode(true);


        return cardElement;

    }

    _setLikeEvent() {
        this._likeButton.addEventListener("click", () => {
            this._likeButton.classList.toggle("main__button_like-active");

            const likeIcon = this._likeButton.querySelector(".main__gallery-like");
            if (this._likeButton.classList.contains("main__button_like-active")) {
                likeIcon.src = "./images/likeblack.png";
            } else {
                likeIcon.src = "./images/like.png";

            }
            
        });
    }

    _setRemoveEvent() { 
        this._removeButton.addEventListener("click", () => { 
            this._handleDeleteClick(this._cardId, this._element);
        });
    }



        /*this._removeButton.addEventListener("click", () => {
            this._element.remove();
            this._element = null;

        });
    }
*/
    _setImageEvent() {
        this._imageElement.addEventListener("click", () => {
            this._handleCardClick(this._name, this._link);
        });
    }

    _setEventListeners() {
        this._setLikeEvent();
        this._setRemoveEvent();
        this._setImageEvent();
    }


    generateCard() {
     this._element = this._getTemplate();
    this._imageElement = this._element.querySelector(".main__gallery-image");
    this._titleElement = this._element.querySelector(".main__gallery-paragraph");
    this._likeButton = this._element.querySelector(".main__button_like");
    this._removeButton = this._element.querySelector(".main__button_remove");

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._titleElement.textContent = this._name;

    this._setEventListeners();

    return this._element;

    }
}
