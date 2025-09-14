import { setupAuth } from "./auth.mjs";
import { setupListings } from "./listings.mjs";
import { setupCreateListing } from "./createListing.mjs";

document.addEventListener("DOMContentLoaded", () => {
  setupAuth();

  const { loadListings } = setupListings();
  loadListings();

  setupCreateListing();

  // Navigasjonsknapper
  document.getElementById("nav-all").addEventListener("click", () => {
    document.getElementById("listings-section").style.display = "block";
    document.getElementById("create-listing-section").style.display = "none";
  });

  document.getElementById("nav-create").addEventListener("click", () => {
    document.getElementById("listings-section").style.display = "none";
    document.getElementById("create-listing-section").style.display = "block";
  });
});
