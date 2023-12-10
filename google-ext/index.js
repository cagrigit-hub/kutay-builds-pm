// store 12345 in local storage
localStorage.setItem("myCat", "Tom");

const button = document.getElementById("get_token");

function retrieveToken() {
  var token = localStorage.getItem("myCat");
  console.log(token);
  return token;
}

button.addEventListener("click", retrieveToken);

const set_token = document.getElementById("set_token");
function setToken() {
  localStorage.setItem("myCat", "Tom");
}

set_token.addEventListener("click", setToken);
