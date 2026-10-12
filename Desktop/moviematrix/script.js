
const OMDB_API_KEY = "e8b86e21";

// HTML elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const moodInput = document.getElementById("moodInput");
const moodBtn = document.getElementById("moodBtn");
const moviesContainer = document.getElementById("moviesContainer");
const similarMoviesDiv = document.getElementById("similarMovies");

// Search movies by title
searchBtn.addEventListener("click", () => {
  const movieName = searchInput.value.trim();

  if (!movieName) {
    alert("Please enter a movie name");
    return;
  }

  searchMovies(movieName);
});

// Search OMDb for movies
function searchMovies(query) {
  moviesContainer.innerHTML = "Searching for movies...";
  similarMoviesDiv.innerHTML = "";

  fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`
  )
    .then(async response => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Movie service request failed");
      }

      if (data.Response === "False") {
        moviesContainer.innerHTML =
          `<p>${data.Error || "No movies found."}</p>`;
        return null;
      }

      return data.Search;
    })
    .then(movies => {
      if (movies) showMovies(movies);
    })
    .catch(error => {
      console.error("Movie search error:", error);
      moviesContainer.innerHTML = "Error loading movies. Please try again.";
    });
}

// Display movie search results
function showMovies(movies) {
  moviesContainer.innerHTML = "";

  movies.forEach(movie => {
    const div = document.createElement("div");
    div.className = "movie-card";

    const poster =
      movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";

    div.innerHTML = `
      <img src="${poster}" alt="Movie poster" width="150">
      <h3></h3>
      <p></p>
      <button type="button">More Info</button>
      <hr>
    `;

    div.querySelector("h3").textContent = movie.Title;
    div.querySelector("p").textContent = movie.Year;

    div.querySelector("button").addEventListener("click", () => {
      showMovieDetails(movie.imdbID);
    });

    moviesContainer.appendChild(div);
  });
}

// Display details of a selected movie
function showMovieDetails(imdbID) {
  moviesContainer.innerHTML = "Loading movie details...";
  similarMoviesDiv.innerHTML = "";

  fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`
  )
    .then(response => response.json())
    .then(movie => {
      if (movie.Response === "False") {
        throw new Error(movie.Error || "Movie details unavailable");
      }

      const poster =
        movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";

      moviesContainer.innerHTML = `
        <div class="movie-details">
          <img class="detail-poster" alt="Movie poster">
          <h2 class="detail-title"></h2>
          <p class="detail-genre"></p>
          <p class="detail-rating"></p>
          <p class="detail-plot"></p>
        </div>
      `;

      moviesContainer.querySelector(".detail-poster").src = poster;
      moviesContainer.querySelector(".detail-title").textContent =
        movie.Title;
      moviesContainer.querySelector(".detail-genre").textContent =
        `Genre: ${movie.Genre}`;
      moviesContainer.querySelector(".detail-rating").textContent =
        `Rating: ${movie.imdbRating}`;
      moviesContainer.querySelector(".detail-plot").textContent =
        movie.Plot;

      showSimilarMovies(movie.Genre);
    })
    .catch(error => {
      console.error("Movie details error:", error);
      moviesContainer.innerHTML = "Unable to load movie details.";
    });
}

// Convert a genre into a search keyword
function getExampleKeyword(genreText) {
  const genre = genreText.toLowerCase().trim();

  const genreKeywords = {
    comedy: "comedy",
    romance: "romance",
    romantic: "romance",
    action: "action",
    drama: "drama",
    horror: "horror",
    thriller: "thriller",
    adventure: "adventure",
    animation: "animation",
    fantasy: "fantasy",
    mystery: "mystery",
    "science fiction": "science fiction",
    "sci-fi": "science fiction"
  };

  return genreKeywords[genre] || genre;
}

// Display additional movie suggestions based on a genre keyword
function showSimilarMovies(genreText) {
  similarMoviesDiv.innerHTML = "<h3>More Movies to Explore</h3>";

  if (!genreText || genreText === "N/A") {
    similarMoviesDiv.innerHTML += "<p>No genre information available.</p>";
    return;
  }

  const keyword = getExampleKeyword(genreText);

  fetch(
    `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(keyword)}`
  )
    .then(response => response.json())
    .then(data => {
      if (data.Response === "False" || !data.Search) {
        similarMoviesDiv.innerHTML += "<p>No additional movies found.</p>";
        return;
      }

      const list = document.createElement("div");
      list.className = "similar-list";

      data.Search.slice(0, 6).forEach(movie => {
        const card = document.createElement("div");
        card.className = "similar-card";

        const poster =
          movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "";

        card.innerHTML = `
          <img alt="Movie poster" width="100">
          <p></p>
        `;

        card.querySelector("img").src = poster;
        card.querySelector("p").textContent = movie.Title;

        card.addEventListener("click", () => {
          showMovieDetails(movie.imdbID);
        });

        list.appendChild(card);
      });

      similarMoviesDiv.appendChild(list);
    })
    .catch(error => {
      console.error("Similar movies error:", error);
      similarMoviesDiv.innerHTML +=
        "<p>Unable to load additional movies.</p>";
    });
}

// Mood button
moodBtn.addEventListener("click", () => {
  const moodText = moodInput.value.trim();

  if (!moodText) {
    alert("Please enter your mood");
    return;
  }

  getGenreFromGemini(moodText);
});

// Send the user's mood to the Node.js backend
async function getGenreFromGemini(moodText) {
  moviesContainer.innerHTML = "Understanding your mood...";
  similarMoviesDiv.innerHTML = "";

  try {
    const response = await fetch("http://localhost:3000/mood", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: moodText })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.details?.error?.message ||
        data.error ||
        "Mood analysis request failed"
      );
    }

    if (!data.genre) {
      throw new Error("No genre was returned by Gemini");
    }

    console.log("Gemini genre:", data.genre);

    // Use the returned genre to search for movies
    searchMovies(getExampleKeyword(data.genre));
  } catch (error) {
    console.error("Mood analysis error:", error);

    moviesContainer.textContent =
      `Mood analysis failed: ${error.message}`;
  }
}


function getExampleKeyword(genreText) {
  const genre = genreText.toLowerCase().trim();

  const genreKeywords = {
    comedy: "comedy",
    romance: "romance",
    romantic: "romance",
    action: "action",
    drama: "drama",
    horror: "horror",
    thriller: "thriller",
    adventure: "adventure",
    animation: "animation",
    fantasy: "fantasy",
    mystery: "mystery",
    "science fiction": "science fiction",
    "sci-fi": "science fiction"
  };

  return genreKeywords[genre] || genre;
}
