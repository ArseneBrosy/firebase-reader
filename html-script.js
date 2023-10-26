function openCloseObject(id) {
  const object = document.querySelector(`#${id}`);
  if (object.classList.contains("opened")) {
    object.classList.remove("opened");
    object.classList.add("closed");
  } else {
    object.classList.remove("closed");
    object.classList.add("opened");
  }
}
