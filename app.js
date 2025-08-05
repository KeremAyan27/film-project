// app.js
// Select DOM Elements

const form = document.getElementById("film-form");
const title = document.getElementById("title");
const director = document.getElementById("director");
const url = document.getElementById("url");
const filmList = document.getElementById("films");
const clearBtn = document.getElementById("clear-films");


// Add a Single Film Row to the UI

// Add a Single Film Row to the UI
function addFilmToUI(film) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>
      <img 
        src="${film.url}" 
        onerror="this.onerror=null;this.src='assets/images/balim-placeholder.jpg';" 
        class="img-fluid img-thumbnail" 
        style="max-width: 100px;" 
        alt="Film Poster"
      >
    </td>
    <td class="film-cell" title="${film.title}">${film.title}</td>
    <td class="film-cell" title="${film.director}">${film.director}</td>
    <td>
      <a href="#" class="btn btn-danger delete-film">Delete</a>
    </td>
  `;
  filmList.appendChild(newRow);
}


// Display Alert Messages to the User

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


// Save a Film Object to localStorage

function saveFilmToStorage(film) {
  const films = JSON.parse(localStorage.getItem("films")) || [];
  films.push(film);
  localStorage.setItem("films", JSON.stringify(films));
}


// Delete Film from Storage by Title

function deleteFilmFromStorage(title) {
  const films = JSON.parse(localStorage.getItem("films")) || [];
  const updatedFilms = films.filter((film) => film.title !== title);
  localStorage.setItem("films", JSON.stringify(updatedFilms));
}


// Load All Stored Films on Page Load

document.addEventListener("DOMContentLoaded", () => {
  const films = JSON.parse(localStorage.getItem("films")) || [];
  films.forEach(addFilmToUI);
});


// Handle Form Submission to Add New Film

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const filmTitle = title.value.trim();
  const filmDirector = director.value.trim();
  const filmUrl = url.value.trim();

  if (!filmTitle || !filmDirector || !filmUrl) {
    showMessage("Please fill in all fields.", "danger");
    return;
  }

  const newFilm = {
    title: filmTitle,
    director: filmDirector,
    url: filmUrl,
  };

  addFilmToUI(newFilm);
  saveFilmToStorage(newFilm);
  showMessage("Film added successfully.", "success");

  form.reset();
});


// Handle Deleting a Single Film from UI + Storage

filmList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-film")) {
    const row = e.target.closest("tr");
    const titleToDelete = row.children[1].textContent;

    row.remove();
    deleteFilmFromStorage(titleToDelete);
    showMessage("Film deleted.", "warning");
  }
});


// Handle "Clear All Films" Button Click

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filmList.innerHTML = "";
  localStorage.removeItem("films");
  showMessage("All films cleared.", "danger");
});
