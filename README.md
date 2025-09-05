🎬 Movies App
A full-stack single-page application built with React 19 + Vite on the frontend and Node.js 22 + Express + PostgreSQL on the backend.
The app allows users to search movies via the OMDb API
, manage personal movie lists (add, edit, delete, toggle favorites), and persist user data in a PostgreSQL database.

🚀 Tech Stack
Frontend
React 19 (Vite-based SPA)
TypeScript
Redux Toolkit + RTK Query
React Router 7
React Hook Form 7
SCSS Modules
Vitest (unit testing)

Backend
Node.js 22 + Express 5
PostgreSQL
pg (node-postgres) for DB access
zod for validation
Hosted via Docker / Render

✨ Features
🔍 Search movies by title (fetched via OMDb API through the Express backend).
⭐ Favorites filter: toggle and view only favorite movies.
➕ Add movie: modal with validated form fields (title, year, runtime, genre, director).
✏️ Edit movie: update details in a modal with validation.
🗑️ Delete movie: confirm deletion via popup.
🎨 Responsive UI using CSS grid/flexbox and SCSS modules.
🧪 Unit tests with Vitest for components, forms, and utils.

👤 User handling:
Prompt for username before managing movies.
Username stored in DB (per-user movie list).
Simplified login (no authentication).

⚙️ Setup & Run

1. Clone the repository
   git clone https://github.com/your-username/movies-app.git
   cd movies-app

2. Run PostgreSQL with Docker
   docker compose up -d

3. Backend (Express)
   cd server
   cp .env.example .env # set OMDB_API_KEY and DB credentials
   npm install
   npm run migrate
   npm run dev

Server runs at: http://localhost:3001

4. Frontend (React + Vite)
   cd client
   npm install
   npm run dev

Frontend runs at: http://localhost:5173

🧪 Testing
npm run test

📌 Notes
Usernames are immutable once created.
Movie titles are unique and validated both client & server side.
All API requests are proxied through the Express server — frontend never calls OMDb directly.

🗄️ Database Schema
CREATE TABLE users (
username TEXT PRIMARY KEY
);

CREATE TABLE movies (
title TEXT PRIMARY KEY,
year TEXT NOT NULL CHECK (year ~ '^\d{4}$'),
runtime TEXT NOT NULL,
genre TEXT NOT NULL,
director TEXT NOT NULL,
favourite BOOLEAN NOT NULL DEFAULT false,
created_at TIMESTAMPTZ DEFAULT now(),
updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_movies (
username TEXT NOT NULL REFERENCES users(username) ON DELETE CASCADE,
title TEXT NOT NULL REFERENCES movies(title) ON DELETE CASCADE,
PRIMARY KEY (username, title)
);
