let logoutHandler = null;

export function setLogoutHandler(fn) {
  logoutHandler = fn;
}

export async function apiFetch(url, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      // handle 401 Unauthorized globally
      if (res.status === 401) {
        localStorage.removeItem("token");
        if (logoutHandler) logoutHandler();
      }

      // throw error for the calling component
      throw new Error(data.error || "Unknown API error");
    }

    return data; // successful response
  } catch (err) {
    console.error("API fetch error:", err);
    throw err; // rethrow so the component can handle it too
  }
}
