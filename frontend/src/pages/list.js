import { getGames } from "../api.js";

export async function renderList(root, navigate) {
  root.innerHTML = `<p class="loading">Loading games...</p>`;

  let games;
  try {
    games = await getGames();
  } catch (err) {
    root.innerHTML = `<p class="error">${escapeHtml(err.message)}</p>`;
    return;
  }

  root.innerHTML = `
    <header class="topbar">
      <a href="/" data-link class="brand">Games Library</a>
      <a href="/new" data-link class="btn">Add game</a>
    </header>

    <section class="hero">
      <h1>Find your next game</h1>
      <p class="hero-sub">
        Browse the collection, then add, edit, or remove any title.
      </p>
      <form class="search" id="search-form" novalidate>
        <input
          id="game-search"
          type="search"
          autocomplete="off"
          placeholder="Search by title, genre, platform, or developer"
          aria-label="Search games"
        />
        <button type="submit">Search</button>
      </form>
    </section>

    <p class="results-count" id="results-count"></p>
    <div id="game-results"></div>
  `;

  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("game-search");
  const countEl = document.getElementById("results-count");
  const resultsEl = document.getElementById("game-results");

  // Only the results block is redrawn, so typing never steals focus from the input
  function renderResults() {
    const query = searchInput.value;
    const visible = games.filter((game) => matches(game, query));

    countEl.textContent = query.trim()
      ? `${visible.length} of ${games.length} games match "${query.trim()}"`
      : `${games.length} games in your library`;

    if (visible.length === 0) {
      resultsEl.innerHTML = `
        <p class="empty-state">
          ${
            games.length === 0
              ? "Your library is empty. Use Add game to save your first one."
              : "No games match your search. Try a different word."
          }
        </p>
      `;
      return;
    }

    resultsEl.innerHTML = `
      <ul class="game-list">
        ${visible.map(gameCard).join("")}
      </ul>
    `;
  }

  searchForm.addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", renderResults);

  renderResults();
}

function gameCard(game) {
  return `
    <li>
      <a href="/game/${game.id}" data-link data-art="${game.id % 6}">
        <strong>${escapeHtml(game.title)}</strong>
        <span>${escapeHtml(game.genre)} · ${escapeHtml(game.platform)} · ${game.release_year}</span>
      </a>
    </li>`;
}

function matches(game, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const haystack = [
    game.title,
    game.genre,
    game.platform,
    game.developer,
    game.release_year,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(needle);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
