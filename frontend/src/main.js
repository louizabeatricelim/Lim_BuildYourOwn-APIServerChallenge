import "./style.css";
import { renderList } from "./pages/list.js";
import { renderDetail } from "./pages/detail.js";
import { renderForm } from "./pages/form.js";

const app = document.querySelector("#app");

function navigate(path) {
  history.pushState({}, "", path);
  route();
}

window.addEventListener("popstate", route);

// Let clicks on <a href="/..."> use the SPA router
document.addEventListener("click", (e) => {
  const link = e.target.closest("a[data-link]");
  if (link) {
    e.preventDefault();
    navigate(link.getAttribute("href"));
  }
});

async function route() {
  const path = window.location.pathname;

  if (path === "/") {
    await renderList(app, navigate);
    return;
  }
  if (path === "/new") {
    await renderForm(app, navigate, { mode: "create" });
    return;
  }

  const editMatch = path.match(/^\/game\/(\d+)\/edit$/);
  if (editMatch) {
    await renderForm(app, navigate, { mode: "edit", id: editMatch[1] });
    return;
  }

  const detailMatch = path.match(/^\/game\/(\d+)$/);
  if (detailMatch) {
    await renderDetail(app, navigate, detailMatch[1]);
    return;
  }

  app.innerHTML = `
    <h1>Page not found</h1>
    <p class="error">That page does not exist.</p>
    <a href="/" data-link>Back to list</a>
  `;
}

route();