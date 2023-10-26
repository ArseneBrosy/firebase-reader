import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

//let database;

document.querySelector("#database-url").addEventListener("change", (e) => {
  try {
    let database = getDatabase(initializeApp({databaseURL: document.querySelector("#database-url").value}));
    onValue(ref(database), (snapshot) => {
      const JSONValue = JSON.stringify(snapshot.val());
      console.log(JSONValue);

      // construct the HTML
      let HTMLElements = "";
      let currentPropOrValue = "";
      let i = 0;
      let objectId = 0;
      for (let char of JSONValue) {
        if (["\"", "{", "}", ":", ","].includes(char)) {
          // is structure char
          if (currentPropOrValue !== "") {
            if (JSONValue[i + 2] === "{") {
              // is an object
              HTMLElements += `<div class="object closed" id="object-${objectId}"><div class="line"><button onclick="openCloseObject('object-${objectId}')"><span class="material-symbols-outlined">arrow_right</span></button><a href="">${currentPropOrValue}</a></div>`;
              objectId++;
            }
            else if (JSONValue[i + 1] === ":") {
              // is a property
              HTMLElements += `<div class="property"><div class="line"><a href="">${currentPropOrValue}</a>`;
            } else {
              // is a value
              HTMLElements += `<button>${currentPropOrValue}</button></div></div>`;
            }
            currentPropOrValue = "";
          }

          if (char === "}" && i < JSONValue.length - 1) {
            HTMLElements += "</div>";
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
/*
onValue(ref(database), (snapshot) => {
  const JSONValue = JSON.stringify(snapshot.val());
  console.log(JSONValue);

  // construct the HTML
  let HTMLElements = "";
  let currentPropOrValue = "";
  let i = 0;
  let objectId = 0;
  for (let char of JSONValue) {
    if (["\"", "{", "}", ":", ","].includes(char)) {
      // is structure char
      if (currentPropOrValue !== "") {
        if (JSONValue[i + 2] === "{") {
          // is an object
          HTMLElements += `<div class="object closed" id="object-${objectId}"><div class="line"><button onclick="openCloseObject('object-${objectId}')"><span class="material-symbols-outlined">arrow_right</span></button><a href="">${currentPropOrValue}</a></div>`;
          objectId++;
        }
        else if (JSONValue[i + 1] === ":") {
          // is a property
          HTMLElements += `<div class="property"><div class="line"><a href="">${currentPropOrValue}</a>`;
        } else {
          // is a value
          HTMLElements += `<button>${currentPropOrValue}</button></div></div>`;
        }
        currentPropOrValue = "";
      }

      if (char === "}" && i < JSONValue.length - 1) {
        HTMLElements += "</div>";
      }
    } else {
      // is a prop or value char
      currentPropOrValue += char;
    }
    i++;
  }

  document.querySelector("#data").innerHTML = HTMLElements;
});*/