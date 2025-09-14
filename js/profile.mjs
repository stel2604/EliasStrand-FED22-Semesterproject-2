// profile.mjs
import { updateAvatar, fetchProfile } from "./api.mjs";
import { showAlert } from "./ui.mjs";

export function setupProfile() {
  const profileSection = document.getElementById("profile-section");
  const avatarForm = document.getElementById("avatar-form");
  const avatarUrlInput = document.getElementById("avatar-url");
  const userAvatar = document.getElementById("user-avatar");
  const userCredits = document.getElementById("user-credits");

  if (!avatarForm) return; // hvis ikke HTML-seksjonen finnes

  // Oppdater avatar når skjemaet sendes inn
  avatarForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = localStorage.getItem("userName");
    const avatarUrl = avatarUrlInput.value.trim();

    if (!userName) {
      showAlert("⚠ Du må være logget inn for å endre avatar.", "warning");
      return;
    }

    if (!avatarUrl) {
      showAlert("⚠ Vennligst skriv inn en gyldig URL.", "warning");
      return;
    }

    const result = await updateAvatar(userName, avatarUrl);

    if (result) {
      showAlert("✅ Avatar oppdatert!", "success");

      // oppdater i navbar
      if (userAvatar) {
        userAvatar.src = avatarUrl;
        userAvatar.style.display = "block";
      }

      // hent profil på nytt (for sikkerhet)
      const profile = await fetchProfile(userName);
      if (profile && userCredits) {
        userCredits.textContent = `Kreditt: ${profile.credits}`;
      }
    } else {
      showAlert("❌ Kunne ikke oppdatere avatar.", "danger");
    }
  });
}
