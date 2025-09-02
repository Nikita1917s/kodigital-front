import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Movies, type MoviesProps } from ".";

const mockMovies = [
  {
    Title: "Alice Wonderland",
    Year: "alice",
    Runtime: "120",
    Genre: "Fantasy",
    Director: "John Doe",
  },
  {
    Title: "Bob Builder",
    Year: "bob",
    Runtime: "90",
    Genre: "Animation",
    Director: "Jane Smith",
  },
] as MoviesProps["movies"];

describe("Movies component", () => {
  const renderWithRouter = (ui: React.ReactElement) =>
    render(<MemoryRouter>{ui}</MemoryRouter>);

  it("renders all movies initially", () => {
    renderWithRouter(<Movies movies={mockMovies} />);
    expect(screen.getByText("Alice Wonderland")).toBeInTheDocument();
    expect(screen.getByText("Bob Builder")).toBeInTheDocument();
  });

  it("filters the list as you type", () => {
    renderWithRouter(<Movies movies={mockMovies} />);

    const input = screen.getByRole("textbox", {
      name: /filter movies by Title/i,
    });
    fireEvent.change(input, { target: { value: "bob" } });

    expect(screen.queryByText("Alice Wonderland")).not.toBeInTheDocument();
    expect(screen.getByText("Bob Builder")).toBeInTheDocument();
  });

  it('shows "No movies found" if filter matches none', () => {
    renderWithRouter(<Movies movies={mockMovies} />);

    const input = screen.getByRole("textbox", {
      name: /filter movies by Title/i,
    });
    fireEvent.change(input, { target: { value: "xyz" } });

    expect(screen.getByText(/No movies found\./i)).toBeInTheDocument();
  });
});
