const API_BASE = "http://127.0.0.1:5000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // API returns { "error": "..." } for 400 and 404
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return data;
}

export function getGames() {
  return request("/games");
}

export function getGame(id) {
  return request(`/games/${id}`);
}

export function createGame(body) {
  return request("/games", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateGame(id, body) {
  return request(`/games/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteGame(id) {
  return request(`/games/${id}`, {
    method: "DELETE",
  });
}