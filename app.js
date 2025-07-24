// ─── Select DOM Elements ───────────────────────────────────────────────
const form = document.getElementById("film-form");
const title = document.getElementById("title");
const director = document.getElementById("director");
const url = document.getElementById("url");
const filmList = document.getElementById("films");
const clearBtn = document.getElementById("clear-films");

// ─── Reusable UI Function: Add Film to UI ──────────────────────────────
function addFilmToUI(film) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td><img src="${film.url}" class="img-fluid img-thumbnail" style="max-width: 100px;" alt="Film Poster"></td>
    <td>${film.title}</td>
    <td>${film.director}</td>
    <td><a href="#" class="btn btn-danger delete-film">Delete</a></td>
  `;
  filmList.appendChild(newRow);
}

// ─── Show Alert Message to User ────────────────────────────────────────
function showMessage(message, type) {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const tableMessage = document.querySelector(".table-message");
  tableMessage.innerHTML = "";
  tableMessage.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 2000);
}

// ─── Save Film to Local Storage ───────────────────────────────────────
function saveFilmToStorage(film) {
  let films = JSON.parse(localStorage.getItem("films")) || [];
  films.push(film);
  localStorage.setItem("films", JSON.stringify(films));
}

// ─── Delete Film from Local Storage by Title ───────────────────────────
function deleteFilmFromStorage(title) {
  let films = JSON.parse(localStorage.getItem("films")) || [];
  films = films.filter((film) => film.title !== title);
  localStorage.setItem("films", JSON.stringify(films));
}

// ─── Load All Films from Storage on Page Load ──────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const films = JSON.parse(localStorage.getItem("films")) || [];
  films.forEach(addFilmToUI);
});

// ─── Form Submission: Add New Film ─────────────────────────────────────
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const filmTitle = title.value.trim();
  const filmDirector = director.value.trim();
  const filmUrl = url.value.trim();

  if (filmTitle === "" || filmDirector === "" || filmUrl === "") {
    showMessage("Please fill in all fields.", "danger");
    return;
  }

  const newFilm = {
    title: filmTitle,
    director: filmDirector,
    url: filmUrl,
  };

  addFilmToUI(newFilm); // Add to UI
  saveFilmToStorage(newFilm); // Add to localStorage
  showMessage("Film added successfully.", "success");

  form.reset();
});

// ─── Delete Single Film: UI + Storage ──────────────────────────────────
filmList.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-film")) {
    const row = e.target.closest("tr");
    const titleToDelete = row.children[1].textContent;
    row.remove();
    deleteFilmFromStorage(titleToDelete);
    showMessage("Film deleted.", "warning");
  }
});

// ─── Clear All Films: UI + Storage ─────────────────────────────────────
clearBtn.addEventListener("click", function (e) {
  e.preventDefault();
  filmList.innerHTML = "";
  localStorage.removeItem("films");
  showMessage("All films cleared.", "danger");
});
