import "@/styles/index.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import { MoviesPage } from "@/pages/movies";
import { MovieDetailsPage } from "@/pages/moviesDetails";
import { NotFoundPage } from "@/pages/404";
import { AuthBar } from "@/components/AuthBar";
import AuthProvider from "./contexts/AuthContext";
import { LoginModalProvider } from "./contexts/LoginModalProvider";

export default function App() {
  return (
    <AuthProvider>
      <LoginModalProvider>
        <AuthBar />
        <main>
          <div className="wrapper">
            <Routes>
              <Route path="/" element={<Navigate to="/movies" replace />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>
      </LoginModalProvider>
    </AuthProvider>
  );
}
