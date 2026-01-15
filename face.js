const cam = document.getElementById("cam");
const msg = document.getElementById("msg");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => cam.srcObject = stream);

function scanFace() {
  msg.textContent = "Scanning...";
  setTimeout(() => {
    msg.textContent = "✅ Unlocked";
  }, 3000);
}
