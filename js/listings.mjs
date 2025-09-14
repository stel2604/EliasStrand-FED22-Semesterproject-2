// listings.mjs
import { fetchListings, placeBid } from "./api.mjs";
import { showAlert } from "./ui.mjs";

export function setupListings() {
  console.log("Listings system initialized");
}

export async function loadListings() {
  const listingsContainer = document.getElementById("listings");
  listingsContainer.innerHTML = "<p>Laster oppføringer...</p>";

  try {
    const listings = await fetchListings();

    if (!listings || listings.length === 0) {
      listingsContainer.innerHTML = "<p>Ingen oppføringer enda – lag en ny!</p>";
      return;
    }

    listingsContainer.innerHTML = "";

    // 👉 Beregn aktive og avsluttede oppføringer
    const now = new Date();
    const activeCount = listings.filter(
      (l) => new Date(l.endsAt) > now
    ).length;
    const finishedCount = listings.length - activeCount;

    // 👉 Teller for antall oppføringer
    const countEl = document.createElement("h4");
    countEl.className = "mb-4 text-center";
    countEl.textContent = `Antall oppføringer: ${listings.length} (Aktive: ${activeCount}, Avsluttet: ${finishedCount})`;
    listingsContainer.appendChild(countEl);

    listings.forEach((listing) => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-4";

      // lag bud-liste
      const bidsHtml =
        listing.bids && listing.bids.length > 0
          ? `<ul class="list-unstyled mb-2">
               ${listing.bids
                 .sort((a, b) => b.amount - a.amount) // høyeste først
                 .map(
                   (b) =>
                     `<li>${b.bidderName || "Anonym"}: <strong>${b.amount} kr</strong></li>`
                 )
                 .join("")}
             </ul>`
          : "<p class='text-muted mb-2'>Ingen bud enda</p>";

      // fallback bilde + avsluttet sjekk
      const ended = new Date(listing.endsAt) <= now;
      const imgHtml =
        listing.media && listing.media.length > 0 && listing.media[0].url
          ? `<img src="${listing.media[0].url}" class="card-img-top" alt="${listing.media[0].alt || "Bilde"}">`
          : `<img src="https://via.placeholder.com/300x200?text=Ingen+bilde" class="card-img-top" alt="Ingen bilde">`;

      col.innerHTML = `
        <div class="card h-100 shadow-sm w-100">
          ${imgHtml}
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description || ""}</p>
            <p><strong>Antall bud:</strong> ${listing.bids ? listing.bids.length : 0}</p>
            ${bidsHtml}
            <p><strong>Slutter:</strong> ${new Date(listing.endsAt).toLocaleString()}</p>

            <!-- Bud seksjon -->
            <div class="mt-auto">
              ${
                ended
                  ? `<div class="alert alert-secondary mb-0">Auksjonen er avsluttet</div>`
                  : `
                    <input type="number" class="form-control mb-2 bid-input" placeholder="Ditt bud (kr)">
                    <button class="btn btn-primary w-100 bid-btn" data-id="${listing.id}">
                      Legg inn bud
                    </button>
                  `
              }
            </div>
          </div>
        </div>
      `;

      listingsContainer.appendChild(col);
    });

    // Legg til event listeners for bud-knapper
    document.querySelectorAll(".bid-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        const input = e.target.closest(".card").querySelector(".bid-input");
        const amount = parseInt(input.value, 10);

        if (isNaN(amount) || amount <= 0) {
          showAlert("⚠ Du må skrive inn et gyldig tall som bud.", "warning");
          return;
        }

        try {
          const result = await placeBid(id, amount);
          showAlert("✅ Bud lagt inn!", "success");
          await loadListings(); // Oppdater listen
        } catch (err) {
          showAlert(`❌ Kunne ikke legge inn bud: ${err.message}`, "danger");
        }
      });
    });
  } catch (err) {
    console.error("Feil ved lasting av oppføringer:", err);
    listingsContainer.innerHTML =
      "<p>⚠ Kunne ikke laste oppføringer. Prøv igjen senere.</p>";
  }
}
