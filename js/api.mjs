// api.mjs
export const API_BASE = "https://api.noroff.dev/api/v1/auction";
const API_KEY = "a67c14fd-d4cd-4153-89af-28d60e25936a"; // ← din API-nøkkel

// Hjelpefunksjon for headers
function getHeaders(includeAuth = true) {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
    ...(includeAuth && token && { Authorization: `Bearer ${token}` }),
  };
}

// ======================= AUTH =======================

// Registrer ny bruker
export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Register error:", data);
      return null;
    }

    return data;
  } catch (err) {
    console.error("⚠️ Register exception:", err);
    return null;
  }
}

// Logg inn
// Logg inn
export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Login error:", data);
      return null;
    }

    // lagre token og brukernavn
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userName", data.name);

    return data;
  } catch (error) {
    console.error("⚠️ loginUser exception:", error);
    return null;
  }
}

// ======================= LISTINGS =======================

// Hent alle oppføringer
// Hent alle oppføringer (inkludert bud og selger-info)
export async function fetchListings() {
  try {
    const res = await fetch(`${API_BASE}/listings?_bids=true&_seller=true`, {
      headers: getHeaders(false), // auth ikke nødvendig
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Fetch listings error:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("⚠️ Fetch listings exception:", err);
    return [];
  }
}


// Opprett ny oppføring
export async function createListing(listingData) {
  try {
    const res = await fetch(`${API_BASE}/listings`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(listingData),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Create listing error:", data.errors || data); // viser hele feilmeldingen
      return null;
    }

    return data;
  } catch (err) {
    console.error("⚠️ Create listing exception:", err);
    return null;
  }
}


// Legg inn bud
// api.mjs
export async function placeBid(listingId, amount) {
  try {
    const res = await fetch(`${API_BASE}/listings/${listingId}/bids`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg =
        data?.errors?.[0]?.message || `${res.status} ${res.statusText}`;
      throw new Error(msg); // <-- viktig
    }

    return data;
  } catch (err) {
    console.error("❌ placeBid failed:", err);
    throw err; // la UI vise dette
  }
}




// ======================= PROFILE =======================

// Hent en profil (inkludert credits og avatar)
export async function fetchProfile(name) {
  try {
    const res = await fetch(`${API_BASE}/profiles/${name}`, {
      headers: getHeaders(),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Fetch profile error:", data);
      return null;
    }

    return data;
  } catch (err) {
    console.error("⚠️ Fetch profile exception:", err);
    return null;
  }
}

// Oppdater avatar for innlogget bruker
export async function updateAvatar(name, avatarUrl) {
  try {
    const res = await fetch(`${API_BASE}/profiles/${name}/media`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ avatar: avatarUrl }),
    });
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Update avatar error:", data);
      return null;
    }

    return data;
  } catch (err) {
    console.error("⚠️ Update avatar exception:", err);
    return null;
  }
}

// ======================= SEARCH =======================

// Søk i oppføringer
export async function searchListings(query) {
  try {
    const res = await fetch(
      `${API_BASE}/listings?_bids=true&title=${encodeURIComponent(query)}`,
      {
        headers: getHeaders(false), // søk kan gjøres uten login
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Search listings error:", data);
      return [];
    }

    return data;
  } catch (err) {
    console.error("⚠️ Search listings exception:", err);
    return [];
  }
}
