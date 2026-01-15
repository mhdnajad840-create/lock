const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let pattern = [];

canvas.addEventListener("click", e => {
  const x = Math.floor(e.offsetX / 100);
  const y = Math.floor(e.offsetY / 100);
  const dot = `${x}${y}`;

  if (!pattern.includes(dot)) {
    pattern.push(dot);
    ctx.fillRect(x * 100 + 40, y * 100 + 40, 20, 20);
  }

  if (pattern.length >= 4) checkPattern();
});

async function checkPattern() {
  const hashVal = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(pattern.join(""))
  );

  if (!localStorage.getItem("pattern")) {
    localStorage.setItem("pattern", hashVal);
    alert("Pattern Saved");
  } else {
    alert("Pattern Checked");
  }
}
