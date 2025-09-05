import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types/Movie";
import styles from "./Movies.module.scss";
import { Toggle } from "@components/UI/Toggle";
import { EditIcon, PlusIcon, StarIcon, TrashIcon } from "@components/UI/Icons";
import { ActionButton } from "@components/UI/ActionButton";
import { ModalWindow } from "@components/UI/ModalWindow";
import { AddMovieForm } from "@components/forms/AddMovieForm";
import { DeleteMovieForm } from "@components/forms/DeleteMovieForm";
import { EditMovieForm } from "@components/forms/EditMovieForm";
import { formatTitle } from "@/utils/formatTitle";

type ModalMode = "create" | "edit" | "delete";

export interface MoviesProps {
  movies: Movie[];
  search: string;
  setSearch: (value: string) => void;
  onCreate: (movie: Movie) => boolean | Promise<boolean>;
  onUpdate: (movie: Movie, originalTitle: string) => boolean | Promise<boolean>;
  onToggleFavourite: (Title: string) => void;
  onDelete: (Title: string) => void;
  isLoggedIn: boolean;
  requireLogin: () => void;
}

export const Movies = ({
  movies = [],
  search,
  setSearch,
  onCreate,
  onUpdate,
  onToggleFavourite,
  onDelete,
  isLoggedIn,
  requireLogin,
}: MoviesProps) => {
  const navigate = useNavigate();

  const [showOnlyFavourite, setShowOnlyFavourite] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selected, setSelected] = useState<Movie | null>(null);

  const openCreate = () => {
    setSelected(null);
    setModalMode("create");
    setOpenModal(true);
  };
  const openEdit = (m: Movie) => {
    setSelected(m);
    setModalMode("edit");
    setOpenModal(true);
  };
  const openDelete = (m: Movie) => {
    setSelected(m);
    setModalMode("delete");
    setOpenModal(true);
  };

  const searched = movies
    .filter((m) => m.Title.toLowerCase().includes(search.toLowerCase()))
    .filter((m) => (showOnlyFavourite ? m.Favourite : true));

  return (
    <div className={styles["wrapper"]}>
      <h1 className={styles["title"]}>Movies App</h1>
      <div className={styles["actionBlock"]}>
        <Toggle
          text={showOnlyFavourite ? "Favourite movies" : "All movies"}
          toggleState={showOnlyFavourite}
          changeToggleState={setShowOnlyFavourite}
        />
        <div className={styles["buttonWrapper"]}>
          <ActionButton
            onClick={() => (isLoggedIn ? openCreate() : requireLogin())}
          >
            <PlusIcon /> Add Movie
          </ActionButton>
        </div>
      </div>
      <div className={styles["searchField"]}>
        <input
          type="text"
          placeholder="Search by title…"
          name="Filter"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          aria-label="Filter movies by title"
        />
        {search && (
          <button
            type="button"
            className={styles["clearButton"]}
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
      <div className={styles["movieList"]}>
        {searched.map((movie) => (
          <div key={movie.Title} className={styles["movieCard"]}>
            <p className={styles["movieTitle"]}>
              Title: {formatTitle(movie.Title)}
            </p>
            <p className={styles["movieField"]}>Year: {movie.Year}</p>
            <p className={styles["movieField"]}>Runtime: {movie.Runtime}</p>
            <p className={styles["movieField"]}>Genre: {movie.Genre}</p>
            <p className={styles["movieField"]}>Director: {movie.Director}</p>
            <div className={styles["detailedButtonWrapper"]}>
              <ActionButton
                onClick={() =>
                  navigate(`/movies/${encodeURIComponent(movie.Title)}`)
                }
              >
                Details
              </ActionButton>
            </div>
            <div className={styles["buttonWrapper"]}>
              <button
                type="button"
                onClick={() => (isLoggedIn ? openEdit(movie) : requireLogin())}
                aria-label="Edit movie"
              >
                <EditIcon size={40} />
              </button>

              <button
                type="button"
                className={styles["buttonFavourite"]}
                onClick={() =>
                  isLoggedIn ? onToggleFavourite(movie.Title) : requireLogin()
                }
                aria-label={
                  movie.Favourite
                    ? "Remove from favourites"
                    : "Add to favourites"
                }
              >
                <StarIcon
                  size={40}
                  {...(!movie.Favourite ? { fill: "#808080" } : {})}
                />
              </button>
              <button
                type="button"
                onClick={() => (isLoggedIn ? openDelete(movie) : requireLogin())}
                aria-label="Delete movie"
              >
                <TrashIcon size={40} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {searched.length === 0 && (
        <p className={styles["notFound"]}>
          {search.trim()
            ? "No movies matched your search."
            : "Start by searching for a movie or add a new one"}
        </p>
      )}

      <ModalWindow open={openModal} onClose={() => setOpenModal(false)}>
        {modalMode === "create" && (
          <>
            <h2>Add a new movie</h2>
            <AddMovieForm
              onSubmit={(values) => {
                const ok = onCreate(values);
                if (ok) setOpenModal(false);
              }}
              onCancel={() => setOpenModal(false)}
            />
          </>
        )}

        {modalMode === "edit" && selected && (
          <>
            <h2>Edit movie</h2>
            <EditMovieForm
              defaultValues={selected}
              onSubmit={(values) => {
                const ok = onUpdate(values, selected.Title);
                if (ok) setOpenModal(false);
              }}
              onCancel={() => setOpenModal(false)}
            />
          </>
        )}

        {modalMode === "delete" && selected && (
          <>
            <h2>Delete movie</h2>
            <DeleteMovieForm
              Title={selected.Title}
              onCancel={() => setOpenModal(false)}
              onConfirm={() => {
                onDelete(selected.Title);
                setOpenModal(false);
              }}
            />
          </>
        )}
      </ModalWindow>
    </div>
  );
};
