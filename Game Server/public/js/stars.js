const canvas = document.getElementById("bg-stars");
if (!canvas) throw new Error("Canvas bg-stars not found");

const ctx = canvas.getContext("2d");

let stars = [];
const STAR_COUNT = 120;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

/* ===== CREATE STARS ===== */
function createStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.15 + 0.05,
      alpha: Math.random() * 0.5 + 0.3
    });
  }
}
createStars();

/* ===== ANIMATE ===== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,220,255,${s.alpha})`;
    ctx.fill();

    s.y -= s.speed;
    if (s.y < 0) {
      s.y = canvas.height;
      s.x = Math.random() * canvas.width;
    }
  });

  requestAnimationFrame(animate);
}

animate();