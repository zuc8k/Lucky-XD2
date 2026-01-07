// ===== PAGE ENTER =====
window.addEventListener("load", () => {
  document.body.classList.add("page-enter");
});

// ===== PAGE EXIT =====
document.querySelectorAll("a, button").forEach(el => {
  el.addEventListener("click", e => {
    const link =
      el.tagName === "A"
        ? el.getAttribute("href")
        : null;

    if (link && !link.startsWith("#") && !link.startsWith("javascript")) {
      e.preventDefault();
      document.body.classList.remove("page-enter");
      document.body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = link;
      }, 300);
    }
  });
});