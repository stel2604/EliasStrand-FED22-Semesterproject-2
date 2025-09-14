import { fetchListings, placeBid } from "./api.mjs";
import { showAlert } from "./ui.mjs";

export function setupListings() {
  const listingsContainer = document.getElementById("listings");

  async function loadListings() {
    listingsContainer.innerHTML = "<p>Laster oppføringer...</p>";
    const listings = await fetchListings();

    if (listings.length === 0) {
      listingsContainer.innerHTML =
        "<p>Ingen oppføringer enda – lag en ny!</p>";
      return;
    }

    listingsContainer.innerHTML = "";

    listings.forEach((listing) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3 d-flex";
 // Bootstrap grid

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          ${
            listing.media && listing.media.length > 0
              ? `<img src="${listing.media[0].url}" class="card-img-top" alt="${listing.media[0].alt || "Bilde"}">`
              : ""
          }
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description || ""}</p>
            <p><strong>Antall bud:</strong> ${listing._count?.bids || 0}</p>
            <p><strong>Slutter:</strong> ${new Date(
              listing.endsAt
            ).toLocaleString()}</p>
            
            <!-- Bud-seksjon -->
            <div class="mt-auto">
              <input type="number" class="form-control mb-2 bid-input" placeholder="Ditt bud (kr)" />
              <button class="btn btn-primary w-100 bid-btn" data-id="${
                listing.id
              }">Legg inn bud</button>
            </div>
          </div>
        </div>
      `;

      listingsContainer.appendChild(col);
    });

    // Legg til event listeners for alle bud-knapper
    document.querySelectorAll(".bid-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const listingId = e.target.dataset.id;
        const input = e.target
          .closest(".card-body")
          .querySelector(".bid-input");
        const amount = parseInt(input.value);

        if (!amount || amount <= 0) {
          showAlert("Vennligst skriv inn et gyldig bud.", "danger");
          return;
        }

        const result = await placeBid(listingId, amount);
        if (result) {
          showAlert("Bud lagt inn!", "success");
          loadListings(); // last opp igjen for å vise oppdatert bud
        } else {
          showAlert("Kunne ikke legge inn bud.", "danger");
        }
      });
    });
  }

  return { loadListings };
}
