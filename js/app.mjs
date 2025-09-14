// app.mjs
import { setupAuth } from "./auth.mjs";
import { renderListings } from "./listings.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  setupAuth();

  const navbar = document.getElementById("navbar");
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const listingsSection = document.getElementById("listings-section");

  // Navigasjon
  const navAll = document.getElementById("nav-all");
  const navCreate = document.getElementById("nav-create");

  if (navAll) {
    navAll.addEventListener("click", async () => {
      listingsSection.style.display = "block";
      document.getElementById("create-listing-section").style.display = "none";
      await renderListings();
    });
  }

  if (navCreate) {
    navCreate.addEventListener("click", () => {
      listingsSection.style.display = "none";
      document.getElementById("create-listing-section").style.display = "block";
    });
  }

  // 👇 Sjekk om bruker allerede er logget inn
  const token = localStorage.getItem("accessToken");
  if (token) {
    navbar.style.display = "flex";
    loginSection.style.display = "none";
    registerSection.style.display = "none";
    listingsSection.style.display = "block";

    // Last oppføringer automatisk
    await renderListings();
  }
});
