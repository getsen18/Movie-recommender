# 🎬 MovieMatrix

**Discover movies that match your mood.**

MovieMatrix is a movie discovery web application that helps users find movies through title-based searches or mood-based recommendations. By combining the capabilities of Google's Gemini API and the OMDb API, the application transforms a user's mood into movie genre suggestions and retrieves relevant movie information.

## ✨ Features

- **🔍 Movie Search:** Search for movies by title.
- **🎭 Mood-Based Discovery:** Describe your mood and receive movie recommendations suited to it.
- **🤖 Gemini AI-Powered Recommendations:** Uses the Gemini API to interpret moods and identify suitable movie genres.
- **🎥 Movie Information:** Retrieves movie details, including plots, ratings and genres, through the OMDb API.
- **💻 Simple Web Interface:** Built with HTML, CSS and JavaScript.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Webpage structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend logic and API interactions |
| Node.js | Backend runtime |
| Express.js | Backend server and API routes |
| Google Gemini API | Mood interpretation and genre recommendations |
| OMDb API | Movie information and metadata |
| dotenv | Environment variable management |

## 📁 Project Structure

```text
MovieMatrix/
├── back.js          # Node.js backend and API integration
├── index.html       # Main webpage
├── script.js        # Frontend functionality
├── style.css        # Styling
├── search icon.png  # Search icon asset
├── .env             # Private API keys (not committed)
├── .env.example     # Example environment configuration
├── .gitignore       # Files excluded from Git
├── package.json     # Project dependencies and scripts
└── README.md        # Project documentation
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MovieMatrix
```

### 2. Install dependencies

Make sure Node.js and npm are installed.

```bash
npm install
```

If dependencies have not yet been added to `package.json`, install the required packages used by your backend:

```bash
npm install express cors dotenv
```

Install any additional packages imported by `back.js` if they are not already listed.

### 3. Configure environment variables

Create a `.env` file in the project root. Add the API keys and configuration variables expected by your backend.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
OMDB_API_KEY=your_omdb_api_key
PORT=3000
```

Obtain API credentials from:

- [Google AI Studio](https://aistudio.google.com/) — Gemini API
- [OMDb API](https://www.omdbapi.com/apikey.aspx) — Movie data

**Important:** The environment variable names in `.env` must match the names read by `back.js`. Never commit your actual `.env` file or publish API keys.

### 4. Start the backend

```bash
node back.js
```

The backend should run on port `3000` if configured with the default port shown above.

### 5. Start the frontend

Open a second terminal in the project directory and run:

```bash
npx http-server . -p 5500
```

Open the local URL displayed by the server, usually:

```text
http://localhost:5500
```

Keep both servers running while using the application.

## 🔄 How It Works

### Title-Based Search

1. The user enters a movie title.
2. The application sends a request to retrieve matching movie information.
3. The results are displayed through the frontend.

### Mood-Based Recommendations

1. The user describes their current mood.
2. The frontend sends the mood to the backend.
3. The Gemini API interprets the mood and suggests suitable genres.
4. The OMDb API retrieves relevant movie information.
5. The frontend displays the recommendations.

## 🔐 Security

- API keys are stored in environment variables rather than committed to the repository.
- The `.env` file is excluded using `.gitignore`.
- API requests requiring secret credentials are handled by the backend.

Create a `.env.example` file with placeholder values so other developers know which environment variables to configure.

## 🔮 Future Improvements

- Add movie posters and richer movie details.
- Improve recommendation relevance with additional user preferences.
- Support filtering by year, genre and IMDb rating.
- Add watchlists and favourites.
- Improve loading states and error handling.
- Deploy the frontend and backend for public access.

## 👩‍💻 Contributing

Contributions and suggestions are welcome. Fork the repository, create a feature branch, make your changes and submit a pull request.

## 📄 License

A license has not yet been specified. Add a license before distributing the project for reuse.
