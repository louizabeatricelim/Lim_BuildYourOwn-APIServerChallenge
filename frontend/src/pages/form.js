import { createGame, getGame, updateGame } from "../api.js";

export async function renderForm(root, navigate, { mode, id }) {
  let initial = {
    title: "",
    genre: "",
    platform: "",
    release_year: "",
    developer: "",
    rating: "",
  };

  if (mode === "edit") {
    root.innerHTML = `<p class="loading">Loading...</p>`;
    try {
      initial = await getGame(id);
    } catch (err) {
      root.innerHTML = `
        <h1>Game not found</h1>
        <p class="error">${escapeHtml(err.message)}</p>
        <a href="/" data-link>Back</a>
      `;
      return;
    }
  }

  root.innerHTML = `
    <a href="/" data-link>← Back</a>
    <h1>${mode === "edit" ? "Edit game" : "Add game"}</h1>
    <form id="game-form" novalidate>
      <label>Title <input name="title" value="${escapeAttr(initial.title)}" /></label>
      <label>Genre <input name="genre" value="${escapeAttr(initial.genre)}" /></label>
      <label>Platform <input name="platform" value="${escapeAttr(initial.platform)}" /></label>
      <label>Release year <input name="release_year" type="number" value="${escapeAttr(initial.release_year)}" /></label>
      <label>Developer <input name="developer" value="${escapeAttr(initial.developer)}" /></label>
      <label>Rating (optional) <input name="rating" type="number" step="0.1" value="${escapeAttr(initial.rating ?? "")}" /></label>
      <p id="form-error" class="error" hidden></p>
      <button type="submit">${mode === "edit" ? "Save" : "Create"}</button>
    </form>
  `;

  const form = document.getElementById("game-form");
  const errorEl = document.getElementById("form-error");

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const fd = new FormData(form);
    const body = {
      title: fd.get("title"),
      genre: fd.get("genre"),
      platform: fd.get("platform"),
      release_year: fd.get("release_year") === "" ? "" : Number(fd.get("release_year")),
      developer: fd.get("developer"),
    };
    const rating = fd.get("rating");
    if (rating !== "") body.rating = Number(rating);

    try {
      if (mode === "edit") {
        await updateGame(id, body);
        navigate(`/game/${id}`);
      } else {
        const created = await createGame(body);
        navigate(`/game/${created.id}`);
      }
    } catch (err) {
      // Shows API 400 text, e.g. Missing required fields: genre, platform, ...
      errorEl.textContent = err.message;
      errorEl.hidden = false;
    }
  };
}

function escapeAttr(str) {
  return String(str ?? "").replaceAll('"', "&quot;");
}
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}