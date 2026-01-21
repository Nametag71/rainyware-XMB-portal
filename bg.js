const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const stars = [];
const numStars = 1750;

for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * width - width/2,
    y: Math.random() * height - height/2,
    z: Math.random() * width,
    prevZ: Math.random() * width
  });
}

function animate() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#0000ff";

  for (let i = 0; i < numStars; i++) {
    let star = stars[i];

    let k = 128.0 / star.z;
    let x = star.x * k + width / 2;
    let y = star.y * k + height / 2;

    let prevK = 128.0 / star.prevZ;
    let px = star.x * prevK + width / 2;
    let py = star.y * prevK + height / 2;

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(x, y);
    ctx.stroke();

    star.prevZ = star.z;
    star.z -= 1.5;

    if (star.z <= 0) {
      star.z = width;
      star.prevZ = star.z;
      star.x = Math.random() * width - width/2;
      star.y = Math.random() * height - height/2;
    }
  }

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

animate();
