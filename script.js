import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {getDatabase, onValue, ref, update, set} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

let database;

document.querySelector("#database-url").addEventListener("change", (e) => {
  try {
    database = getDatabase(initializeApp({databaseURL: document.querySelector("#database-url").value}));
    onValue(ref(database), (snapshot) => {
      const JSONValue = JSON.stringify(snapshot.val());
      fillData(JSONValue);
    });
  } catch {
    alert("an error occured");
  }
});

function fillData(JSONData) {
  let HTMLElements = "";
  let currentPropOrValue = "";
  let i = 0;
  let objectId = 0;
  let valueId = 0;
  let insideObject = [];
  let prop = "";

  let pathToProps = [];
  let props = [];

  // find opened objects
  let openedObjectsId = [];
  let searchId = 0;
  while (document.querySelector(`#object-${searchId}`) !== null) {
    if (document.querySelector(`#object-${searchId}`).classList.contains("opened")) {
      openedObjectsId.push(searchId);
    }
    searchId ++;
  }

  for (let char of JSONData) {
    if (["\"", "{", "}", ":", ","].includes(char)) {
      // is structure char
      if (currentPropOrValue !== "") {
        if (JSONData[i + 2] === "{") {
          // is an object
          insideObject.push(currentPropOrValue);
          let pathToProp = "";
          for (let step of insideObject) {
            pathToProp += (pathToProp === "" ? "" : "/") + step;
          }
          if (pathToProp === "") {
            pathToProp = "/";
          }
          HTMLElements += `<div class="object ${openedObjectsId.includes(objectId) ? "opened" : "closed"}" id="object-${objectId}"><div class="line"><button onclick="openCloseObject('object-${objectId}')"><span class="material-symbols-outlined">arrow_right</span></button><a href="#">${currentPropOrValue}</a>`;
          HTMLElements += `<span class="line-hoverer"></span>`;
          HTMLElements += `<button class="add"><span class="material-symbols-outlined">add</span></button>`;
          HTMLElements += `<button onclick="document.dispatchEvent(new CustomEvent('delete-object', {detail: {path: '${pathToProp}'}}))" class="delete"><span class="material-symbols-outlined">delete</span></button></div>`;
          objectId++;
        }
        else if (JSONData[i + 1] === ":") {
          // is a property
          HTMLElements += `<div class="property"><div class="line"><a href="#">${currentPropOrValue}</a>`;
          prop = currentPropOrValue;
        } else {
          // is a value
          let pathToProp = "";
          for (let step of insideObject) {
            pathToProp += (pathToProp === "" ? "" : "/") + step;
          }
          if (pathToProp === "") {
            pathToProp = "/";
          }
          HTMLElements += `<button id="value-${valueId}" onclick="startEdit('${currentPropOrValue}', 'value-${valueId}')">${currentPropOrValue}</button>`;
          HTMLElements += `<input type="text" id="value-${valueId}-input" style="display: none">`;
          HTMLElements += `<span class="line-hoverer"></span>`;
          HTMLElements += `<button onclick="document.dispatchEvent(new CustomEvent('delete-prop', {detail: {path: '${pathToProp}', prop: '${prop}'}}))" class="delete"><span class="material-symbols-outlined">delete</span></button></div></div>`;
          pathToProps.push(pathToProp);
          props.push(prop);
          valueId++;
        }
        currentPropOrValue = "";
      }

      if (char === "}" && i < JSONData.length - 1) {
        HTMLElements += "</div>";
        insideObject.pop();
      }
    } else {
      // is a prop or value char
      currentPropOrValue += char;
    }
    i++;
  }

  document.querySelector("#data").innerHTML = HTMLElements;

  // add the edit event listeners
  for (let i = 0; i < valueId; i++) {
    document.querySelector(`#value-${i}-input`).addEventListener("change", () => {
      let value = document.querySelector(`#value-${i}-input`).value;
      update(ref(database, pathToProps[i]), {
        [props[i]]: isNaN(value) ? value : parseInt(value)
      });
      endEdit(value, `value-${i}`);
    });
  }
}

document.addEventListener('delete-prop', (e) => {
  update(ref(database, e.detail.path), {
    [e.detail.prop]: null
  });
});

document.addEventListener('delete-object', (e) => {
  set(ref(database, e.detail.path), {});
});

document.addEventListener('add', (e) => {
  update(ref(database, e.detail.path), e.detail.object);
});