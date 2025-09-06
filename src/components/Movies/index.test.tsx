import { render, screen, fireEvent } from "@testing-library/react";
import { Movies } from "./index";
import type { Movie } from "@/types/Movie";
import { MemoryRouter } from "react-router-dom";

const data: Movie[] = [
  {
    Title: "Blade Runner",
    Year: "1982",
    Runtime: "117 min",
    Genre: "Action, Drama, Sci-Fi",
    Director: "Ridley Scott",
    Favourite: false,
  },
  {
    Title: "Heat",
    Year: "1995",
    Runtime: "170 min",
    Genre: "Crime, Thriller",
    Director: "Michael Mann",
    Favourite: true,
  },
];

const noopTrue = () => true;

it("filters by search and favourite", () => {
  let search = "";
  const setSearch = (v: string) => {
    search = v;
  };

  const { rerender, container } = render(
    <MemoryRouter>
      <Movies
        movies={data}
        onCreate={noopTrue}
        onUpdate={noopTrue}
        onToggleFavourite={() => {}}
        onDelete={() => {}}
        search={search}
        setSearch={setSearch}
        isLoggedIn={false}
        requireLogin={() => {}}
      />
    </MemoryRouter>
  );

  // Assert both cards exist using the data-testid (there are two of them)
  const titles = screen.getAllByTestId("movie-title");
  expect(titles).toHaveLength(2);
  expect(titles.map((el) => el.textContent)).toEqual(
    expect.arrayContaining(["Blade Runner", "Heat"])
  );

  expect(
    screen.getByRole("heading", { name: /title:\s*blade runner/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: /title:\s*heat/i })
  ).toBeInTheDocument();

  // Type into the controlled search input and re-render with the new value
  const input = screen.getByPlaceholderText(/search by title/i);
  fireEvent.change(input, { target: { value: "blade" } });
  search = "blade";
  rerender(
    <MemoryRouter>
      <Movies
        movies={data}
        onCreate={noopTrue}
        onUpdate={noopTrue}
        onToggleFavourite={() => {}}
        onDelete={() => {}}
        search={search}
        setSearch={setSearch}
        isLoggedIn={false}
        requireLogin={() => {}}
      />
    </MemoryRouter>
  );

  // Now only Blade Runner should be visible
  expect(
    screen.getByRole("heading", { name: /title:\s*blade runner/i })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /title:\s*heat/i })
  ).not.toBeInTheDocument();

  // Clear search using the clear button
  fireEvent.click(screen.getByRole("button", { name: /clear search/i }));
  search = "";
  rerender(
    <MemoryRouter>
      <Movies
        movies={data}
        onCreate={noopTrue}
        onUpdate={noopTrue}
        onToggleFavourite={() => {}}
        onDelete={() => {}}
        search={search}
        setSearch={setSearch}
        isLoggedIn={false}
        requireLogin={() => {}}
      />
    </MemoryRouter>
  );

  // Toggle favourites ON (checkbox inside the custom switch)
  const favCheckbox = container.querySelector('label input[type="checkbox"]')!;
  fireEvent.click(favCheckbox);

  // Only favourite movies should show: Heat is favourite, Blade Runner is not
  expect(
    screen.getByRole("heading", { name: /title:\s*heat/i })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /title:\s*blade runner/i })
  ).not.toBeInTheDocument();
});
