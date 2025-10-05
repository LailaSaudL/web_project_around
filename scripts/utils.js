export function openPopup(popup) {
  if (popup.tagName === "DIALOG") {
    popup.showModal();
  } else {
    popup.classList.add("popup_opened");
  }
}

export function closePopup(popup) {
  if (popup.tagName === "DIALOG") {
    popup.close();
  } else {
    popup.classList.remove("popup_opened");
  }
}

export function setButtonLoading(button, isLoading, loadingText = "Guardando...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
  }
}
export function setButtonLoading(button, isLoading, loadingText = "Guardando...") {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
  }
}
