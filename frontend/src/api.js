// Thin REST client for the Spring Boot backend. Replaces the old localStorage
// persistence — data now lives in the database and is shared across browsers/devices.
//
// In dev, leave VITE_BACKEND_URL unset: requests go to "/api/..." and Vite proxies
// them to http://localhost:8080 (see vite.config.js). In production, set
// VITE_BACKEND_URL to the deployed backend origin if it's served separately.
const BASE = import.meta.env.VITE_BACKEND_URL || "";

async function http(method, path, body) {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// Builds a CRUD client for one resource, e.g. resource("companies").list()
function resource(name) {
  return {
    list: () => http("GET", `/${name}`),
    create: (data) => http("POST", `/${name}`, data),
    update: (id, data) => http("PUT", `/${name}/${id}`, data),
    remove: (id) => http("DELETE", `/${name}/${id}`),
  };
}

export const companiesApi = resource("companies");
export const neetcodeApi = resource("neetcode");
export const notesApi = resource("notes");
export const linksApi = resource("links");
export const moodApi = resource("mood");
export const reminderLogApi = resource("reminder-log");
