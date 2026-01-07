const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login.html";
}

// ================== SOCKET ==================
const socket = io({
  auth: { token }
});

// ================== USER DATA ==================
fetch("/api/user/me", {
  headers: {
    Authorization: "Bearer " + token
  }
})
.then(res => {
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
})
.then(user => {
  document.getElementById("username").innerText = user.username;
  document.getElementById("avatar").innerText =
    user.username.charAt(0).toUpperCase();

  document.getElementById("rank").innerText =
    `${user.rankBadge || "🥉"} ${user.rank || "Bronze"}`;

  document.getElementById("coins").innerText = user.coins ?? 0;
  document.getElementById("gems").innerText = user.gems ?? 0;
  document.getElementById("level").innerText = user.level ?? 1;
  document.getElementById("wins").innerText = user.wins ?? 0;
})
.catch(() => {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
});

// ================== PLAY NOW ==================
function playNow() {
  socket.emit("find_match");
  alert("🔍 Searching for players...");
}

// ================== MATCH FOUND ==================
socket.on("match_found", ({ roomId }) => {
  window.location.href = `/game.html?room=${roomId}`;
});

// ================== LOGOUT ==================
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login.html";
}