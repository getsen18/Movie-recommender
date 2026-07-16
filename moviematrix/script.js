const OMDB_API_KEY = "e8b86e21";
const GEMINI_API_KEY = "AIzaSyCMmJXub5fLR0gjvlmXVTYWR7qNRGNRZfo";



const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moodInput = document.getElementById("moodInput");
const moodBtn = document.getElementById("moodBtn");
const moviesContainer = document.getElementById("moviesContainer");
const similarMoviesDiv = document.getElementById("similarMovies");



searchBtn.addEventListener("click", function () {
  const movieName = searchInput.value.trim();

  if (movieName === "") {
    alert("Please enter a movie name");
    return;
  }

  searchMovies(movieName);
});

function searchMovies(query) {
  moviesContainer.innerHTML = "Just a bit of patience and finally!";

  fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        moviesContainer.innerHTML = "No movies found";
        return;
      }
      showMovies(data.Search);
    })
    .catch(() => {
      moviesContainer.innerHTML = "Error loading movies";
    });
}


function showMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
div.className="movie-card";
    div.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" width="150">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="showMovieDetails('${movie.imdbID}')">More Info</button>
      <hr>
    `;

    moviesContainer.appendChild(div);
  });
}



function showMovieDetails(imdbID) {
  fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`)
    .then(res => res.json())
    .then(movie => {
      moviesContainer.innerHTML = `
        <div class="movie-details">
          <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" alt="Poster">
          <h2>${movie.Title}</h2>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Rating:</strong> ${movie.imdbRating}</p>
          <p>${movie.Plot}</p>
        </div>
      `;

      showSimilarMovies(movie.Genre);
    });
}


    function showSimilarMovies(genreText) {
  similarMoviesDiv.innerHTML = "<h3>Similar Movies</h3>";

  const keyword = getExampleKeyword(genreText.toLowerCase());

  fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${keyword}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        similarMoviesDiv.innerHTML += "<p>No similar movies found</p>";
        return;
      }

      const list = document.createElement("div");
      list.className = "similar-list";

      data.Search.slice(0, 6).forEach(movie => {
        const card = document.createElement("div");
        card.className = "similar-card";
        card.innerHTML = `
          <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" width="100">
          <p>${movie.Title}</p>
        `;

     
        card.onclick = function () {
          showMovieDetails(movie.imdbID);
        };

        list.appendChild(card);
      });

      similarMoviesDiv.appendChild(list);
    });
}
   
  
      


moodBtn.addEventListener("click", function () {
  const moodText = moodInput.value.trim();

  if (moodText === "") {
    alert("Please enter your mood");
    return;
  }

  moviesContainer.innerHTML = "Understanding your mood...";

  getGenreFromGemini(moodText);
});

function getGenreFromGemini(text) {
  fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Return only one movie genre like comedy, drama, action, romance, horror from this sentence: " + text}]}]})})
    .then(res => res.json())
    .then(data => {
      const genre = data.candidates[0].content.parts[0].text
      .trim()
      .toLowerCase();
      const keyword = getExampleKeyword(genre);
      searchMovies(keyword);
    })
    .catch(() => {
      moviesContainer.innerHTML = "Gemini API error";
    });
}






function getGenreFromGemini(moodText) {
  fetch("http://localhost:3000/mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text: moodText })
  })
    .then(res => res.json())
    .then(data => {
      const genre = data.genre;
      const keyword = getExampleKeyword(genre);
      searchMovies(keyword);
    })
    .catch(() => {
      moviesContainer.innerHTML = "Mood analysis failed";
    });
}
