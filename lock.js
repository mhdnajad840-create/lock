const DEFAULT_PIN = "1234";
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 30000;

const pin = document.getElementById("pin");
const msg = document.getElementById("msg");

async function hash(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

(async () => {
  if (!localStorage.getItem("pinHash")) {
    localStorage.setItem("pinHash", await hash(DEFAULT_PIN));
  }
})();

let attempts = +localStorage.getItem("attempts") || 0;
let lockedUntil = +localStorage.getItem("lockedUntil") || 0;

function goFullscreen() {
  document.documentElement.requestFullscreen?.();
}

function add(n) {
  if (pin.value.length < 4) pin.value += n;
}

function clearPin() {
  pin.value = pin.value.slice(0, -1);
}

function togglePass() {
  pin.type = pin.type === "password" ? "text" : "password";
}

async function login() {
  if (Date.now() < lockedUntil) {
    msg.textContent = "⏳ Locked";
    return;
  }

  if (await hash(pin.value) !== localStorage.getItem("pinHash")) {
    attempts++;
    navigator.vibrate?.(300);
    msg.textContent = `❌ Wrong (${attempts}/3)`;

    if (attempts >= MAX_ATTEMPTS) {
      lockedUntil = Date.now() + LOCK_TIME;
      localStorage.setItem("lockedUntil", lockedUntil);
      attempts = 0;
    }

    localStorage.setItem("attempts", attempts);
    pin.value = "";
    return;
  }

  msg.textContent = "✅ Unlocked";
  document.body.classList.add("glow");
}

async function changePIN() {
  const oldP = document.getElementById("oldPin").value;
  const newP = document.getElementById("newPin").value;

  if (await hash(oldP) !== localStorage.getItem("pinHash")) {
    msg.textContent = "❌ Wrong Old PIN";
    return;
  }

  localStorage.setItem("pinHash", await hash(newP));
  msg.textContent = "✅ PIN Changed";
}
