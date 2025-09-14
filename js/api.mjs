// api.mjs
const API_BASE_URL = "https://v2.api.noroff.dev";

// Din personlige API-nøkkel (fast verdi, hentet fra API-nøkkelverktøyet)
const API_KEY = "f0a16bfc-5ef2-41e9-86eb-329dcd1646ec";

/**
 * Henter headers for forespørsler.
 * Tar med Bearer token hvis brukeren er logget inn.
 */
function getHeaders(authRequired = false) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (authRequired) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

/* ======================
   AUTH
====================== */

/**
 * Registrer en ny bruker
 * @param {string} name - Brukernavn (kun bokstaver, tall og _)
 * @param {string} email - E-post (må være @stud.noroff.no)
 * @param {string} password - Passord (minst 8 tegn)
 */
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Registreringsfeil:", error);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Uventet feil ved registrering:", err);
    return null;
  }
}

/**
 * Logger inn en bruker
 * @param {string} email
 * @param {string} password
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Innloggingsfeil:", error);
      return null;
    }

    const data = await response.json();

    // Lagre accessToken i localStorage
    if (data.data && data.data.accessToken) {
      localStorage.setItem("accessToken", data.data.accessToken);
    }

    return data.data;
  } catch (err) {
    console.error("Uventet feil ved innlogging:", err);
    return null;
  }
}

/* ======================
   LISTINGS
====================== */

/**
 * Hent alle oppføringer
 */
export async function fetchListings() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/listings?_bids=true&_seller=true`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      console.error("Feil ved henting av listings:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (err) {
    console.error("Uventet feil ved henting av listings:", err);
    return [];
  }
}

/**
 * Opprett en ny oppføring
 */
export async function createListing(title, description, endsAt, imageUrl = "") {
  const listingData = {
    title,
    description,
    endsAt,
  };

  if (imageUrl && imageUrl.startsWith("http")) {
    listingData.media = [
      {
        url: imageUrl,
        alt: "Listing image",
      },
    ];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auction/listings`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(listingData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Feil ved opprettelse av listing:", error);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Uventet feil ved opprettelse av listing:", err);
    return null;
  }
}

/**
 * Legg inn et bud på en oppføring
 */
export async function placeBid(listingId, amount) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/listings/${listingId}/bids`,
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({ amount }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Feil ved bud:", error);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error("Uventet feil ved budgivning:", err);
    return null;
  }
}
