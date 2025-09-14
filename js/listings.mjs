// listings.mjs
import { fetchListings, placeBid } from "./api.mjs";
import { showAlert } from "./ui.mjs";

export async function renderListings() {
  const listingsContainer = document.getElementById("listings");

  if (!listingsContainer) {
    console.error("Fant ikke listings-container i DOM");
    return;
  }

  listingsContainer.innerHTML = "<p>Laster oppføringer...</p>";

  try {
    const listings = await fetchListings();

    if (!listings || listings.length === 0) {
      listingsContainer.innerHTML =
        "<p>Ingen oppføringer enda – lag en ny!</p>";
      return;
    }

    listingsContainer.innerHTML = "";

    listings.forEach((listing) => {
      const col = document.createElement("div");
      // Bootstrap grid (uten d-flex som ødela bredden)
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

      col.innerHTML = `
        <div class="card h-100 shadow-sm w-100">
          ${
            listing.media && listing.media.length > 0
              ? `<img src="${listing.media[0].url}" class="card-img-top" alt="${listing.media[0].alt || "Bilde"}">`
              : ""
          }
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description || ""}</p>
            <p><strong>Antall bud:</strong> ${listing._count?.bids || 0}</p>
            <p><strong>Slutter:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>

            <!-- Bud-seksjon -->
            <div class="mt-auto bid-section">
              <input type="number" class="form-control bid-amount" placeholder="Ditt bud" min="1">
              <button class="btn btn-primary btn-sm bid-btn" data-id="${listing.id}">Legg inn bud</button>
            </div>
          </div>
        </div>
      `;

      listingsContainer.appendChild(col);
    });

    // Aktiver bud-knapper
    document.querySelectorAll(".bid-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const amountInput = e.target
          .closest(".bid-section")
          .querySelector(".bid-amount");

        const amount = parseInt(amountInput.value);

        if (!amount || amount <= 0) {
          showAlert("⚠️ Ugyldig bud.", "warning");
          return;
        }

        const result = await placeBid(id, amount);
        if (result) {
          showAlert("✅ Bud lagt inn!", "success");
          await renderListings(); // Oppdater listen
        } else {
          showAlert("❌ Kunne ikke legge inn bud.", "danger");
        }
      });
    });
  } catch (err) {
    console.error("Feil ved henting av oppføringer:", err);
    listingsContainer.innerHTML =
      "<p class='text-danger'>Kunne ikke laste oppføringer.</p>";
  }
}
