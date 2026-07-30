// All requests go through the /api prefix, which is rewritten to the
// backend's root path by the nginx reverse proxy (production) or the
// Vite dev server proxy (local development). No backend URL is baked
// into the frontend build.
const API_BASE = "/api";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function getEmployees() {
  return fetch(`${API_BASE}/employees`).then(handleResponse);
}

export function createEmployee(employee) {
  return fetch(`${API_BASE}/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  }).then(handleResponse);
}
