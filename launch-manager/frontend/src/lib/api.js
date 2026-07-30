const BASE = "/api";

async function request(path, { method = "GET", body, role, name } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-user-role": role,
      "x-user-name": name,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.error || `Error ${res.status}`);
  }
  return payload.data;
}

export const api = {
  listLaunches: (filters, actor) => {
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(filters || {}).filter(([, v]) => v))
    ).toString();
    return request(`/launches${params ? `?${params}` : ""}`, { ...actor });
  },
  getLaunch: (id, actor) => request(`/launches/${id}`, { ...actor }),
  createLaunch: (data, actor) => request(`/launches`, { method: "POST", body: data, ...actor }),
  updateLaunch: (id, data, actor) => request(`/launches/${id}`, { method: "PUT", body: data, ...actor }),
  deleteLaunch: (id, actor) => request(`/launches/${id}`, { method: "DELETE", ...actor }),
  transition: (id, toStatus, comment, actor) =>
    request(`/launches/${id}/transition`, { method: "POST", body: { toStatus, comment }, ...actor }),
  addAsset: (id, data, actor) => request(`/launches/${id}/assets`, { method: "POST", body: data, ...actor }),
  removeAsset: (id, assetId, actor) =>
    request(`/launches/${id}/assets/${assetId}`, { method: "DELETE", ...actor }),
  markets: (actor) => request(`/launches/markets`, { ...actor }),
};
