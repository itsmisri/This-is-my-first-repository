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

// Animated Sequence — "How Distraction Hook Works"
(function initSequenceAnimation() {
  const scene = document.getElementById("sequenceScene");
  if (!scene) return;

  const phone = document.getElementById("scenePhone");
  const person = document.getElementById("scenePerson");
  const leftArm = document.getElementById("personLeftArm");
  const rightArm = document.getElementById("personRightArm");
  const notif = document.getElementById("sPhoneNotif");
  const buzzer = document.getElementById("buzzerWaves");
  const caption = document.getElementById("sceneCaption");
  const replayBtn = document.getElementById("replayBtn");

  const led1 = document.getElementById("hookLed1");
  const led2 = document.getElementById("hookLed2");
  const led3 = document.getElementById("hookLed3");
  const led4 = document.getElementById("hookLed4");
  const dots = scene.querySelectorAll(".step-dot");

  const steps = [
    {
      caption: "A person approaches the desk with their phone",
      action() {
        person.className = "scene-person person-at-desk";
      }
    },
    {
      caption: "The phone is placed on the Distraction Hook stand",
      action() {
        phone.className = "scene-phone phone-on-stand";
      }
    },
    {
      caption: "Working begins — the phone stays on the stand",
      action() {
        leftArm.classList.add("arm-typing");
        rightArm.classList.add("arm-typing");
      }
    },
    {
      caption: "A notification arrives on the phone",
      action() {
        notif.classList.add("notif-visible");
      }
    },
    {
      caption: "The Hook responds — lights flicker and buzzer sounds",
      action() {
        led1.classList.add("led-red");
        led4.classList.add("led-red");
        led2.classList.add("led-yellow");
        led3.classList.add("led-yellow");
        buzzer.classList.add("waves-active");
      }
    },
    {
      caption: "Attention shifts — the person notices the interruption",
      action() {
        person.className = "scene-person person-turning";
        leftArm.classList.remove("arm-typing");
        rightArm.classList.remove("arm-typing");
      }
    },
    {
      caption: "The person picks up the phone to check the notification",
      action() {
        person.className = "scene-person person-reaching";
        leftArm.classList.add("arm-reaching");
        phone.className = "scene-phone phone-picked-up";
      }
    },
    {
      caption: "The response stops — the experience is complete",
      action() {
        led1.className = "hook-led";
        led2.className = "hook-led";
        led3.className = "hook-led";
        led4.className = "hook-led";
        buzzer.classList.remove("waves-active");
      }
    }
  ];

  let currentStep = -1;
  let animTimer = null;
  let isRunning = false;

  function resetScene() {
    phone.className = "scene-phone";
    person.className = "scene-person";
    leftArm.className = "person-arm left-arm";
    rightArm.className = "person-arm right-arm";
    notif.classList.remove("notif-visible");
    buzzer.classList.remove("waves-active");
    led1.className = "hook-led";
    led2.className = "hook-led";
    led3.className = "hook-led";
    led4.className = "hook-led";
    dots.forEach(d => d.classList.remove("active"));
    dots[0].classList.add("active");
    caption.textContent = steps[0].caption;
    currentStep = -1;
  }

  function advanceStep() {
    currentStep++;
    if (currentStep >= steps.length) {
      isRunning = false;
      return;
    }

    // Update dots
    dots.forEach(d => d.classList.remove("active"));
    dots[currentStep].classList.add("active");

    // Update caption
    caption.style.opacity = "0";
    setTimeout(() => {
      caption.textContent = steps[currentStep].caption;
      caption.style.opacity = "1";
    }, 200);

    // Run action
    steps[currentStep].action();

    animTimer = setTimeout(advanceStep, 2200);
  }

  function playSequence() {
    if (isRunning) return;
    isRunning = true;
    resetScene();
    animTimer = setTimeout(advanceStep, 600);
  }

  // Auto-play when in view
  const seqObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        playSequence();
        seqObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  seqObserver.observe(scene);

  // Replay button
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      clearTimeout(animTimer);
      isRunning = false;
      playSequence();
    });
  }
})();

