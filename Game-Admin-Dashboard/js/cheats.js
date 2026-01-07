async function loadCheats() {
  title.innerText = "Cheat Logs";

  const res = await fetch(API_URL + "/admin/cheats");
  const logs = await res.json();

  content.innerHTML = logs.map(l => `
    <div class="card">
      <p><b>User:</b> ${l.userId}</p>
      <p><b>Reason:</b> ${l.reason}</p>
      <p><b>Room:</b> ${l.roomId}</p>
    </div>
  `).join("");
}