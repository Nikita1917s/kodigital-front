import "@testing-library/jest-dom";
import { beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { BASE_URL } from "@/config";

export const server = setupServer(
  // GET /search?q=&page=
  http.get(`${BASE_URL}/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") ?? "").toLowerCase();

    if (!q) {
      return HttpResponse.json({ error: "Missing q" }, { status: 400 });
    }

    const movies =
      q === "blade"
        ? [
            {
              Title: "Blade Runner",
              Year: "1982",
              Runtime: "117 min",
              Genre: "Action, Drama, Sci-Fi",
              Director: "Ridley Scott",
              Favourite: false,
            },
          ]
        : [];

    return HttpResponse.json({ movies });
  }),

  // GET /search/save?username=&q=&page=
  http.get(`${BASE_URL}/search/save`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    const username = url.searchParams.get("username");
    if (!q || !username) {
      return HttpResponse.json({ error: "bad" }, { status: 400 });
    }

    return HttpResponse.json({
      movies: [
        {
          Title: "Heat",
          Year: "1995",
          Runtime: "170 min",
          Genre: "Crime, Thriller",
          Director: "Michael Mann",
          Favourite: true,
        },
      ],
    });
  }),

  // GET /my/movies?username=
  http.get(`${BASE_URL}/my/movies`, ({ request }) => {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");
    if (!username) {
      return HttpResponse.json({ error: "bad" }, { status: 400 });
    }
    return HttpResponse.json({
      movies: [
        {
          Title: "Heat",
          Year: "1995",
          Runtime: "170 min",
          Genre: "Crime, Thriller",
          Director: "Michael Mann",
          Favourite: true,
        },
        {
          Title: "Collateral",
          Year: "2004",
          Runtime: "120 min",
          Genre: "Crime, Thriller",
          Director: "Michael Mann",
          Favourite: false,
        },
      ],
    });
  }),

  // PATCH /my/movies/favourite
  http.patch(`${BASE_URL}/my/movies/favourite`, async () => {
    return HttpResponse.json({ ok: true });
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
