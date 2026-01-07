async function loadPayments() {
  title.innerText = "Payments";

  const res = await fetch(API_URL + "/admin/payments");
  const payments = await res.json();

  content.innerHTML = payments.map(p => `
    <div class="card">
      <p><b>User:</b> ${p.userId}</p>
      <p><b>Provider:</b> ${p.provider}</p>
      <p><b>Coins:</b> ${p.coins}</p>
      <p><b>Status:</b> ${p.status}</p>
    </div>
  `).join("");
}