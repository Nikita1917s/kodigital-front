// src/store/services/moviesApi.test.ts
import { describe, it, expect } from "vitest";
import { moviesApi } from "./moviesApi";
import { makeTestStore } from "@/test/testStore";
import { server } from "@/test/setup";
import { http, HttpResponse } from "msw";
import { BASE_URL } from "@/config";

describe("moviesApi", () => {
  it("searchAnon hits /search with q", async () => {
    let lastUrl = "";

    server.use(
      http.get(`${BASE_URL}/search`, ({ request }) => {
        lastUrl = request.url; // <-- capture here
        return HttpResponse.json({
          movies: [
            {
              Title: "Blade Runner",
              Year: "1982",
              Runtime: "117 min",
              Genre: "Action, Drama, Sci-Fi",
              Director: "Ridley Scott",
              Favourite: false,
            },
          ],
        });
      })
    );

    const store = makeTestStore();
    const res = await store.dispatch(
      moviesApi.endpoints.searchAnon.initiate({ q: "blade" })
    );
    expect(res.data?.length).toBe(1);

    // Verify the URL & query string
    expect(lastUrl).toContain(`${BASE_URL}/search`);
    expect(new URL(lastUrl).searchParams.get("q")).toBe("blade");
  });

  it("searchAndSave returns per-user results and provides tags", async () => {
    const store = makeTestStore();

    const result = await store.dispatch(
      moviesApi.endpoints.searchAndSave.initiate({
        username: "alice",
        q: "anything",
      })
    );

    expect(result.status).toBe("fulfilled");
    expect(result.data).toEqual([expect.objectContaining({ Title: "Heat" })]);
  });

  it("getUserMovies returns a stable user list", async () => {
    const store = makeTestStore();

    const result = await store.dispatch(
      moviesApi.endpoints.getUserMovies.initiate({ username: "bob" })
    );

    expect(result.status).toBe("fulfilled");
    expect(result.data?.length).toBe(2);
    expect(result.data?.[0]).toHaveProperty("Title");
  });

  it("toggleFavourite optimistic update updates cache then confirms", async () => {
    const store = makeTestStore();

    // 1) prime cache
    await store.dispatch(
      moviesApi.endpoints.getUserMovies.initiate({ username: "bob" })
    );

    // 2) before
    let cache = moviesApi.endpoints.getUserMovies.select({
      username: "bob",
    })(store.getState());
    const wasFav = cache.data?.find((m) => m.Title === "Collateral")?.Favourite;
    expect(wasFav).toBe(false);

    // 3) optimistic toggle -> true
    const promise = store.dispatch(
      moviesApi.endpoints.toggleFavourite.initiate({
        username: "bob",
        Title: "Collateral",
        Favourite: true,
      })
    );

    // Immediately after dispatch, cache should be updated
    cache = moviesApi.endpoints.getUserMovies.select({
      username: "bob",
    })(store.getState());
    const nowFav = cache.data?.find((m) => m.Title === "Collateral")?.Favourite;
    expect(nowFav).toBe(true);

    await promise; // wait server confirm
  });

  it("toggleFavourite optimistic update rolls back on server error", async () => {
    const store = makeTestStore();

    // prime cache
    await store.dispatch(
      moviesApi.endpoints.getUserMovies.initiate({ username: "bob" })
    );

    // Force server error
    server.use(
      http.patch(`${BASE_URL}/my/movies/favourite`, () =>
        HttpResponse.json({ error: "boom" }, { status: 500 })
      )
    );

    // Current initial Favourite
    const initial = moviesApi.endpoints.getUserMovies.select({
      username: "bob",
    })(store.getState()).data!;
    const prevFav = initial.find((m) => m.Title === "Collateral")?.Favourite;
    expect(prevFav).toBe(false);

    // Dispatch optimistic toggle to true…
    const p = store.dispatch(
      moviesApi.endpoints.toggleFavourite.initiate({
        username: "bob",
        Title: "Collateral",
        Favourite: true,
      })
    );

    // Optimistic value is true
    let cache = moviesApi.endpoints.getUserMovies.select({
      username: "bob",
    })(store.getState());
    expect(cache.data?.find((m) => m.Title === "Collateral")?.Favourite).toBe(
      true
    );

    // …but server fails -> rollback
    await p;

    cache = moviesApi.endpoints.getUserMovies.select({
      username: "bob",
    })(store.getState());
    expect(cache.data?.find((m) => m.Title === "Collateral")?.Favourite).toBe(
      false
    );
  });
});
