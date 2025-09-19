export class Section {
  constructor({ items, renderer }, containerSelector) {
    this._renderedItems = items || [];
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems() {
    // opcionalmente limpiar
    // this._container.innerHTML = '';
    this._renderedItems.forEach(item => this._renderer(item));
  }

  addItem(element, toStart = true) {
    if (toStart) {
      this._container.prepend(element);
    } else {
      this._container.append(element);
    }
  }
}
