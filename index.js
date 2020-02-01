function loadPage() {
  document.getElementById("titleCard").src = "";
  location.href = "./main.html";
}

document.onkeydown = loadPage;
