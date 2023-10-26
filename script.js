import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

let dbURL = "https://spider-shooter-game-default-rtdb.europe-west1.firebasedatabase.app/";

let database = getDatabase(initializeApp({databaseURL: dbURL}));

onValue(ref(database), (snapshot) => {
  const JSONValue = JSON.stringify(snapshot.val());
  let HTMLElements = "";
  console.log(JSONValue);

  // construct the HTML
  let currentPropOrValue = "";
  let i = 0;
  let objectId = 0;
  for (let char of JSONValue) {
    if (["\"", "{", "}", ":", ","].includes(char)) {
      // is structure char
      if (currentPropOrValue !== "") {
        let mode = "prop";
        if (JSONValue[i + 2] === "{") {
          // is an object
          mode = "object";
          HTMLElements += `<div class="object opened" id="object-${objectId}"><div class="line"><button onclick="openCloseObject('object-${objectId}')"><span class="material-symbols-outlined">arrow_right</span></button><a href="">${currentPropOrValue}</a></div>`;
          objectId++;
        }
        console.log(`${mode}: ${currentPropOrValue}`);
        currentPropOrValue = "";
      }
    } else {
      // is a prop or value char
      currentPropOrValue += char;
    }
    i++;
  }
});
