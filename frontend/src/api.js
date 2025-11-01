let logoutHandler = null;

export function setLogoutHandler(fn) {
  logoutHandler = fn;
}

export async function apiFetch(url, options = {}) {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Authorization": token ? `Bearer ${token}` : "",
      ...options.headers,
    };

    // set Content-Type json only when not sending FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        if (logoutHandler) logoutHandler();
      }
      throw new Error(data.error || "Unknown API error");
    }

    return data;
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
}
