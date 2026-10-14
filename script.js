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

// Animated Sequence — "How Distraction Hook Works" (Editorial Vector Animation)
(function initSequenceAnimation() {
  const scene = document.getElementById("sequenceScene");
  if (!scene) return;

  const phone = document.getElementById("svgPhone");
  const phoneNotif = document.getElementById("svgPhoneNotif");
  const laptop = document.getElementById("svgLaptop");
  const buzzer = document.getElementById("svgBuzzerWaves");
  const armLeft = document.getElementById("svgArmLeft");
  const armRight = document.getElementById("svgArmRight");
  const headGroup = document.getElementById("svgHeadGroup");
  const gaze = document.getElementById("svgGaze");
  const person = document.getElementById("svgPerson");

  const led1 = document.getElementById("svgLed1");
  const led2 = document.getElementById("svgLed2");
  const led3 = document.getElementById("svgLed3");
  const led4 = document.getElementById("svgLed4");

  const stepBadge = document.getElementById("seqStepBadge");
  const stepTitle = document.getElementById("seqStepTitle");
  const stepDesc = document.getElementById("seqStepDesc");
  const dots = scene.querySelectorAll(".step-dot");
  const replayBtn = document.getElementById("replayBtn");

  const steps = [
    {
      badge: "01 / 08",
      title: "Approach",
      desc: "A person brings their phone towards the desk.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-approach";
        phoneNotif.classList.remove("active");
        if (laptop) laptop.classList.remove("typing-active");
        if (buzzer) buzzer.classList.remove("active");
        turnOffLeds();
        setGaze("default");
        setArm("left", "M 685 255 Q 640 295, 590 325");
        setArm("right", "M 725 255 Q 675 270, 625 255");
      }
    },
    {
      badge: "02 / 08",
      title: "Place phone",
      desc: "The person places the phone on the Distraction Hook stand.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-on-stand";
        phoneNotif.classList.remove("active");
        if (laptop) laptop.classList.remove("typing-active");
        if (buzzer) buzzer.classList.remove("active");
        turnOffLeds();
        setGaze("stand");
        setArm("left", "M 685 255 Q 630 305, 580 335");
        setArm("right", "M 725 255 Q 600 290, 500 330");
      }
    },
    {
      badge: "03 / 08",
      title: "Start working",
      desc: "The person begins studying or working on their laptop. The phone remains on the stand.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-on-stand";
        phoneNotif.classList.remove("active");
        if (laptop) laptop.classList.add("typing-active");
        if (buzzer) buzzer.classList.remove("active");
        turnOffLeds();
        setGaze("laptop");
        setArm("left", "M 685 255 Q 480 300, 275 344");
        setArm("right", "M 725 255 Q 520 305, 305 344");
      }
    },
    {
      badge: "04 / 08",
      title: "Notification",
      desc: "A notification arrives silently on the phone screen.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-on-stand";
        phoneNotif.classList.add("active");
        if (laptop) laptop.classList.add("typing-active");
        if (buzzer) buzzer.classList.remove("active");
        turnOffLeds();
        setGaze("laptop");
        setArm("left", "M 685 255 Q 480 300, 275 344");
        setArm("right", "M 725 255 Q 520 305, 305 344");
      }
    },
    {
      badge: "05 / 08",
      title: "Hook responds",
      desc: "The stand reacts with red and yellow lights flickering and a brief buzzer indication.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-on-stand";
        phoneNotif.classList.add("active");
        if (laptop) laptop.classList.add("typing-active");
        turnOnLeds();
        if (buzzer) buzzer.classList.add("active");
        setGaze("laptop");
      }
    },
    {
      badge: "06 / 08",
      title: "Attention shifts",
      desc: "The person pauses and turns their attention toward the phone.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-on-stand";
        phoneNotif.classList.add("active");
        if (laptop) laptop.classList.remove("typing-active");
        turnOnLeds();
        if (buzzer) buzzer.classList.add("active");
        setGaze("stand");
        setArm("left", "M 685 255 Q 620 310, 560 340");
        setArm("right", "M 725 255 Q 650 315, 580 340");
      }
    },
    {
      badge: "07 / 08",
      title: "Check phone",
      desc: "The person picks up the phone and checks the notification.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-picked-up";
        phoneNotif.classList.add("active");
        if (laptop) laptop.classList.remove("typing-active");
        setGaze("phone");
        setArm("left", "M 685 255 Q 630 310, 570 340");
        setArm("right", "M 725 255 Q 670 240, 620 230");
      }
    },
    {
      badge: "08 / 08",
      title: "Response stops",
      desc: "The lights and buzzer response stop when the phone is removed from the stand. The scene settles.",
      action() {
        phone.className.baseVal = "svg-phone-obj pos-picked-up";
        phoneNotif.classList.remove("active");
        turnOffLeds();
        if (buzzer) buzzer.classList.remove("active");
        if (laptop) laptop.classList.remove("typing-active");
        setGaze("phone");
      }
    }
  ];

  function turnOnLeds() {
    if (led1) led1.classList.add("active-red");
    if (led4) led4.classList.add("active-red");
    if (led2) led2.classList.add("active-amber");
    if (led3) led3.classList.add("active-amber");
  }

  function turnOffLeds() {
    if (led1) led1.classList.remove("active-red");
    if (led4) led4.classList.remove("active-red");
    if (led2) led2.classList.remove("active-amber");
    if (led3) led3.classList.remove("active-amber");
  }

  function setArm(side, d) {
    const el = side === "left" ? armLeft : armRight;
    if (el) el.setAttribute("d", d);
  }

  function setGaze(state) {
    if (!person) return;
    person.classList.remove("gaze-laptop", "gaze-stand", "gaze-phone");
    if (state === "laptop") {
      person.classList.add("gaze-laptop");
    } else if (state === "stand") {
      person.classList.add("gaze-stand");
    } else if (state === "phone") {
      person.classList.add("gaze-phone");
    }
  }

  let currentStep = -1;
  let animTimer = null;
  let isRunning = false;

  function updateCaptions(index) {
    if (stepBadge) stepBadge.textContent = steps[index].badge;
    if (stepTitle) stepTitle.textContent = steps[index].title;
    if (stepDesc) stepDesc.textContent = steps[index].desc;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function goToStep(index) {
    if (index < 0 || index >= steps.length) return;
    currentStep = index;
    updateCaptions(index);
    steps[index].action();
  }

  function advanceStep() {
    currentStep++;
    if (currentStep >= steps.length) {
      isRunning = false;
      return;
    }
    goToStep(currentStep);
    animTimer = setTimeout(advanceStep, 2600);
  }

  function playSequence() {
    clearTimeout(animTimer);
    isRunning = true;
    currentStep = -1;
    advanceStep();
  }

  // Clickable step indicator dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearTimeout(animTimer);
      isRunning = false;
      goToStep(index);
    });
  });

  // Replay experience button
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      playSequence();
    });
  }

  // Intersection Observer auto-play when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isRunning) {
        playSequence();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(scene);
})();

