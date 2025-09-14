// createListing.mjs
import { createListing } from "./api.mjs";
import { showAlert } from "./ui.mjs";
import { setupListings } from "./listings.mjs";

export function setupCreateListing() {
  const form = document.getElementById("create-listing-form");
  const listingsSection = document.getElementById("listings-section");
  const createSection = document.getElementById("create-listing-section");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("listing-title").value.trim();
    const description = document.getElementById("listing-description").value.trim();
    const imageUrl = document.getElementById("listing-image").value.trim();
    const endsAt = document.getElementById("listing-endsAt").value;

    if (!title || !endsAt) {
      showAlert(" Du må fylle ut tittel og sluttdato.", "danger");
      return;
    }

    const result = await createListing(title, description, endsAt, imageUrl);
    if (result) {
      showAlert("Oppføring opprettet!", "success");
      form.reset();

      // Bytt tilbake til oppføringsliste
      createSection.style.display = "none";
      listingsSection.style.display = "block";

      // Last inn nye oppføringer
      const { loadListings } = setupListings();
      loadListings();
    } else {
      showAlert(" Kunne ikke opprette oppføring.", "danger");
    }
  });
}
