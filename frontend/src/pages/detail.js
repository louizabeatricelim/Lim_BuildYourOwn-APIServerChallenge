import { getGame, deleteGame } from "../api.js";

export async function renderDetail(root, navigate, id) {
  root.innerHTML = `<p class="loading">Loading game...</p>`;

  try {
    // Fetches the game details from the API using the game's ID.
    const g = await getGame(id);
    // Displays the retrieved game information on the page.
    root.innerHTML = `
      <a href="/" data-link>← Back</a>
      <h1 data-art="${g.id % 6}">${escapeHtml(g.title)}</h1>
      <dl>
        <dt>Genre</dt><dd>${escapeHtml(g.genre)}</dd>
        <dt>Platform</dt><dd>${escapeHtml(g.platform)}</dd>
        <dt>Year</dt><dd>${g.release_year}</dd>
        <dt>Developer</dt><dd>${escapeHtml(g.developer)}</dd>
        <dt>Rating</dt><dd>${g.rating ?? "—"}</dd>
      </dl>
      <a href="/game/${g.id}/edit" data-link class="btn">Edit</a>
      <button type="button" id="delete-btn" class="btn danger">Delete</button>
    `;

    document.getElementById("delete-btn").onclick = async () => {
      if (!confirm(`Delete "${g.title}"?`)) return;
      try {
        // Sends a delete request to the API to remove the selected game.
        await deleteGame(g.id);
        // Navigates back to the games list after successful deletion.
        navigate("/");
      } catch (err) {
        alert(err.message);
      }
    };
  } catch (err) {
    // 404 from API → friendly UI, not blank screen
    root.innerHTML = `
      <h1>Game not found</h1>
      <p class="error">${escapeHtml(err.message)}</p>
      <a href="/" data-link>Back to list</a>
    `;
  }
}

function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }