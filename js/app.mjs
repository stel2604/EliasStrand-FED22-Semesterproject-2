// app.mjs
import { setupAuth } from "./auth.mjs";
import { setupListings, loadListings } from "./listings.mjs";
import { setupCreateListing } from "./createListing.mjs";
import { setupProfile } from "./profile.mjs"; 
import { placeBid } from "./api.mjs"; 

document.addEventListener("DOMContentLoaded", async () => {
  
  // Init alle systemer
  setupAuth();
  setupListings();
  setupCreateListing();
  setupProfile(); 

  const navbar = document.getElementById("navbar");
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const listingsSection = document.getElementById("listings-section");
  const createListingSection = document.getElementById("create-listing-section");
  const profileSection = document.getElementById("profile-section"); 

  const navAll = document.getElementById("nav-all");
  const navCreate = document.getElementById("nav-create");
  const navProfile = document.getElementById("nav-profile"); 

  // Navigasjon: Alle oppføringer
  if (navAll) {
    navAll.addEventListener("click", async () => {
      listingsSection.style.display = "block";
      createListingSection.style.display = "none";
      if (profileSection) profileSection.style.display = "none";
      await loadListings();
    });
  }

  // Navigasjon: Ny oppføring
  if (navCreate) {
    navCreate.addEventListener("click", () => {
      listingsSection.style.display = "none";
      createListingSection.style.display = "block";
      if (profileSection) profileSection.style.display = "none";
    });
  }

  // Navigasjon: Profil
  if (navProfile) {
    navProfile.addEventListener("click", () => {
      listingsSection.style.display = "none";
      createListingSection.style.display = "none";
      if (profileSection) profileSection.style.display = "block";
    });
  }

  // Sjekk om bruker allerede er logget inn (token i localStorage)
  const token = localStorage.getItem("accessToken");
  if (token) {
    navbar.style.display = "flex";
    loginSection.style.display = "none";
    registerSection.style.display = "none";
    listingsSection.style.display = "block";

    // Last oppføringer automatisk
    await loadListings();
  }
    //  Bud-håndtering
  document.body.addEventListener("submit", async (e) => {
    if (e.target.matches(".bid-form")) {
      e.preventDefault();

      const listingId = e.target.dataset.id;
      const amount = parseInt(e.target.querySelector("input").value, 10);

      if (!amount || amount <= 0) {
        alert("Skriv inn et gyldig budbeløp!");
        return;
      }

      const result = await placeBid(listingId, amount);

      if (result) {
        alert(" Budet ditt er lagt inn!");
        await loadListings(); // oppdaterer visningen
      }
    }
  });

});
