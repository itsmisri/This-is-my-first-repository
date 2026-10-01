// Distraction Hook — small, readable vanilla JavaScript
const progressBar = document.getElementById("progressBar");
const demo = document.getElementById("hookDemo");
const triggerBtn = document.getElementById("triggerBtn");
const resetBtn = document.getElementById("resetBtn");
const demoStatus = document.getElementById("demoStatus");

function updateProgress() {
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const amount = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
  progressBar.style.width = `${amount}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

function triggerNotification() {
  demo.classList.add("active");
  demoStatus.textContent = "NOTIFICATION DETECTED / ATTENTION SHIFTED";
  triggerBtn.hidden = true;
  resetBtn.hidden = false;

  // A short browser-generated tone. It only runs after the user's click.
  // If the browser blocks audio, the visual interaction still works.
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audio = new AudioContext();
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 740;
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audio.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.16);
      oscillator.connect(gain);
      gain.connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + 0.17);
      oscillator.addEventListener("ended", () => audio.close());
    }
  } catch (error) {
    // Audio is optional; do nothing if the browser does not allow it.
  }
}

function resetNotification() {
  demo.classList.remove("active");
  demoStatus.textContent = "PHONE READY / WAITING";
  triggerBtn.hidden = false;
  resetBtn.hidden = true;
}

triggerBtn.addEventListener("click", triggerNotification);
resetBtn.addEventListener("click", resetNotification);
