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

let pathToEdit = "";
let propToEdit = "";
function startEdit(path, prop, startValue, buttonId) {
  pathToEdit = path;
  propToEdit = prop;

  document.querySelector(`#${buttonId}`).style.display = "none";
  document.querySelector(`#${buttonId}-input`).value = startValue;
  document.querySelector(`#${buttonId}-input`).style.display = "block";
}