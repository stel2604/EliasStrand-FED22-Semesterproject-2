// createListing.mjs
import { createListing } from "./api.mjs";
import { showAlert } from "./ui.mjs";
import { loadListings } from "./listings.mjs";

export function setupCreateListing() {
  const createForm = document.getElementById("create-listing-form");
  const createSection = document.getElementById("create-listing-section");
  const listingsSection = document.getElementById("listings-section");

  if (!createForm) return;

  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("listing-title").value.trim();
    const description = document.getElementById("listing-description").value.trim();
    const imageInput = document.getElementById("listing-image").value.trim();
    let endsAt = document.getElementById("listing-endsAt").value;

    // Validering
    if (!title || !endsAt) {
      showAlert("Tittel og sluttdato er påkrevd!", "danger");
      return;
    }

    // Konverter til ISO-format
    const endsAtDate = new Date(endsAt);

    if (isNaN(endsAtDate.getTime())) {
      showAlert("Ugyldig datoformat.", "danger");
      return;
    }
    if (endsAtDate <= new Date()) {
      showAlert("Sluttdato må være i fremtiden!", "danger");
      return;
    }

    endsAt = endsAtDate.toISOString();

    // Sjekk media
    let media = [];
    try {
      if (imageInput) {
        new URL(imageInput); // kaster feil hvis ugyldig
        media = [{ url: imageInput, alt: title }];
      }
    } catch {
      showAlert(" Ugyldig bilde-URL. Oppføringen blir lagret uten bilde.", "warning");
    }

// Bygg payload
const data = {
  title,
  description,
  tags: [],
  endsAt,
};

// Bare legg til media hvis vi faktisk har en gyldig bilde-URL som slutter på .jpg/.png/.jpeg
if (imageInput && (imageInput.endsWith(".jpg") || imageInput.endsWith(".jpeg") || imageInput.endsWith(".png"))) {
  data.media = [{ url: imageInput, alt: title }];
}


    // 🔎 Debug: Se payload før vi sender
    console.log(" Oppretter ny oppføring med payload:", data);

    const result = await createListing(data);

    if (result) {
      showAlert("Ny oppføring opprettet!", "success");
      createForm.reset();

      // Bytt tilbake til alle oppføringer
      createSection.style.display = "none";
      listingsSection.style.display = "block";

      // Oppdater listen
      await loadListings();
    } else {
      showAlert(" Kunne ikke opprette oppføring (se konsoll for detaljer).", "danger");
    }
  });
}
