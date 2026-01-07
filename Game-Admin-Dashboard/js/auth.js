async function login() {
  const username = usernameInput.value;
  const password = passwordInput.value;

  // MVP login ثابت
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("admin", "true");
    location.href = "index.html";
  } else {
    alert("Invalid Admin");
  }
}