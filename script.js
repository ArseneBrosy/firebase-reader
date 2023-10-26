import {initializeApp} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import {getDatabase, onValue, ref} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

let dbURL = "https://spider-shooter-game-default-rtdb.europe-west1.firebasedatabase.app/";

let database = getDatabase(initializeApp({databaseURL: dbURL}));

onValue(ref(database), (snapshot) => {
  console.log(snapshot.val());
});