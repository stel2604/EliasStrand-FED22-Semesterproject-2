// ui.mjs
export function showAlert(message, type = "info", timeout = 3000) {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const wrapper = document.createElement("div");
  wrapper.className = `alert alert-${type} alert-dismissible fade show`;
  wrapper.role = "alert";
  wrapper.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(wrapper);

  // Fjern automatisk etter timeout
  if (timeout) {
    setTimeout(() => {
      wrapper.classList.remove("show");
      wrapper.classList.add("hide");
      setTimeout(() => wrapper.remove(), 300);
    }, timeout);
  }
}
