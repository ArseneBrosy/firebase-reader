import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

document.querySelector("#database-url").addEventListener("change", (e) => {
  try {
    let database = getDatabase(initializeApp({databaseURL: document.querySelector("#database-url").value}));
    onValue(ref(database), (snapshot) => {
      const JSONValue = JSON.stringify(snapshot.val());

      // construct the HTML
      let HTMLElements = "";
      let currentPropOrValue = "";
      let i = 0;
      let objectId = 0;
      let valueId = 0;
      let insideObject = [];
      let prop = "";

      // find opened objects
      let openedObjectsId = [];
      let searchId = 0;
      while (document.querySelector(`#object-${searchId}`) !== null) {
        if (document.querySelector(`#object-${searchId}`).classList.contains("opened")) {
          openedObjectsId.push(searchId);
        }
        searchId ++;
      }

      for (let char of JSONValue) {
        if (["\"", "{", "}", ":", ","].includes(char)) {
          // is structure char
          if (currentPropOrValue !== "") {
            if (JSONValue[i + 2] === "{") {
              // is an object
              HTMLElements += `<div class="object ${openedObjectsId.includes(objectId) ? "opened" : "closed"}" id="object-${objectId}"><div class="line"><button onclick="openCloseObject('object-${objectId}')"><span class="material-symbols-outlined">arrow_right</span></button><a href="">${currentPropOrValue}</a></div>`;
              insideObject.push(currentPropOrValue);
              objectId++;
            }
            else if (JSONValue[i + 1] === ":") {
              // is a property
              HTMLElements += `<div class="property"><div class="line"><a href="">${currentPropOrValue}</a>`;
              prop = currentPropOrValue;
            } else {
              // is a value
              let pathToProp = "";
              for (let step of insideObject) {
                pathToProp += (pathToProp === "" ? "" : "/") + step;
              }
              HTMLElements += `<button id="value-${valueId}" onclick="startEdit('${pathToProp}', '${prop}', '${currentPropOrValue}', 'value-${valueId}')">${currentPropOrValue}</button>`;
              HTMLElements += `<input type="text" id="value-${valueId}-input" style="display: none"></div></div>`;
              valueId++;
            }
            currentPropOrValue = "";
          }

          if (char === "}" && i < JSONValue.length - 1) {
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
    });
  } catch {
    alert("an error occured");
  }
});