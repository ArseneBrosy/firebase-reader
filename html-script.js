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

function startEdit(startValue, buttonId) {
  document.querySelector(`#${buttonId}`).style.display = "none";
  document.querySelector(`#${buttonId}-input`).value = startValue;
  document.querySelector(`#${buttonId}-input`).style.display = "block";
}

function endEdit(endValue, buttonId) {
  document.querySelector(`#${buttonId}`).value = endValue;
  document.querySelector(`#${buttonId}-input`).style.display = "none";
  document.querySelector(`#${buttonId}`).style.display = "block";
}

function add(path, object) {
  document.dispatchEvent(new CustomEvent("add", {detail: {path: path, object: object}}));
}