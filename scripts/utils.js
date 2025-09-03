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
