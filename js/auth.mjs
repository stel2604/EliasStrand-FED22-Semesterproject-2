// auth.mjs
import { registerUser, loginUser, fetchProfile } from "./api.mjs";
import { showAlert } from "./ui.mjs";
import { loadListings } from "./listings.mjs";

export function setupAuth() {
  const loginSection = document.getElementById("login-section");
  const registerSection = document.getElementById("register-section");
  const listingsSection = document.getElementById("listings-section");
  const navbar = document.getElementById("navbar");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");
  const userDisplay = document.getElementById("user-display"); 
  const userCredits = document.getElementById("user-credits"); // <span id="user-credits"></span> i HTML
  const userAvatar = document.getElementById("user-avatar");   // <img id="user-avatar">

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
      showAlert("Registrering feilet. Sjekk e-post, brukernavn eller passord.", "danger");
    }
  });

  // Logg inn bruker
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    const result = await loginUser(email, password);

    if (result) {
      showAlert(" Innlogging vellykket!", "success");
      loginSection.style.display = "none";
      registerSection.style.display = "none";
      navbar.style.display = "flex";
      listingsSection.style.display = "block";

      if (userDisplay) {
        userDisplay.textContent = result.name || "Bruker";
      }

      // Hent profil (credits + avatar)
      const profile = await fetchProfile(result.name);
      if (profile) {
        if (userCredits) {
          userCredits.textContent = `Kreditt: ${profile.credits}`;
        }
        if (userAvatar && profile.avatar) {
          userAvatar.src = profile.avatar;
          userAvatar.style.display = "block";
        }
      }

      // Last inn oppføringer etter innlogging
      await loadListings();
    } else {
      showAlert("Innlogging feilet. Sjekk e-post og passord.", "danger");
      console.warn("Login mislyktes for:", email);
    }
  });

  // Logg ut
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    navbar.style.display = "none";
    listingsSection.style.display = "none";
    loginSection.style.display = "block";
    showAlert("ℹ Du er logget ut.", "info");

    if (userDisplay) userDisplay.textContent = "";
    if (userCredits) userCredits.textContent = "";
    if (userAvatar) {
      userAvatar.src = "";
      userAvatar.style.display = "none";
    }
  });
}
