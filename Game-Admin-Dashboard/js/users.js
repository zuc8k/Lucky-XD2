async function loadUsers() {
  title.innerText = "Users";

  const res = await fetch(API_URL + "/admin/users");
  const users = await res.json();

  content.innerHTML = users.map(u => `
    <div class="card">
      <p><b>${u.username}</b> (${u.uid})</p>
      <p>Coins: ${u.coins}</p>
      <button onclick="banUser('${u._id}')">Ban</button>
    </div>
  `).join("");
}

async function banUser(id) {
  alert("Ban user: " + id);
}