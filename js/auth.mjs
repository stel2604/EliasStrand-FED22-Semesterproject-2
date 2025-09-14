// auth.mjs
import { registerUser, loginUser } from "./api.mjs";
import { renderListings } from "./listings.mjs"; // <-- bruk renderListings
import { showAlert } from "./ui.mjs";

export function setupAuth() {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const listingsSection = document.getElementById("listings-section");
  const navbar = document.getElementById("navbar");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  // Bytt til register
  document.getElementById("switch-to-register").addEventListener("click", () => {
    loginSection.style.display = "none";
    registerSection.style.display = "block";
  });

  // Bytt til login
  document.getElementById("switch-to-login").addEventListener("click", () => {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
  });

  // Registrer ny bruker
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    const result = await registerUser(name, email, password);
    if (result) {
      showAlert("Registrering vellykket! Du kan nå logge inn.", "success");
      registerSection.style.display = "none";
      loginSection.style.display = "block";
    } else {
      showAlert("Registrering feilet. Sjekk e-post og passord.", "danger");
    }
  });

  // Logg inn bruker
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const result = await loginUser(email, password);
    if (result) {
      showAlert("Innlogging vellykket!", "success");
      loginSection.style.display = "none";
      registerSection.style.display = "none";
      navbar.style.display = "flex";
      listingsSection.style.display = "block";

      // Nå viser vi oppføringene i UI-et
      await renderListings();
    } else {
      showAlert(" Innlogging feilet. Sjekk brukernavn og passord.", "danger");
    }
  });

  // Logg ut
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    navbar.style.display = "none";
    listingsSection.style.display = "none";
    loginSection.style.display = "block";
    showAlert("ℹ️ Du er logget ut.", "info");
  });
}
