import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { MovieDetails } from "./index";
import type { Movie } from "@/types/Movie";

vi.mock("@/assets/img", () => ({
  MovieIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="movie-icon" {...props} />
  ),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const movie: Movie = {
  Title: "Blade Runner",
  Year: "1982",
  Runtime: "117 min",
  Genre: "Action, Drama, Sci-Fi",
  Director: "Ridley Scott",
  Favourite: false,
};

describe("MovieDetails", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders movie details and navigates back on click", () => {
    render(
      <MemoryRouter>
        <MovieDetails movie={movie} />
      </MemoryRouter>
    );

    expect(screen.getByTestId("movie-icon")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /blade runner/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/year:\s*1982/i)).toBeInTheDocument();
    expect(screen.getByText(/runtime:\s*117 min/i)).toBeInTheDocument();
    expect(
      screen.getByText(/genre:\s*action, drama, sci-fi/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/director:\s*ridley scott/i)).toBeInTheDocument();

    const backBtn = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
