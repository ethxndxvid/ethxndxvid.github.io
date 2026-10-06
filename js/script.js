/* =========================
   REVEAL ANIMATIONS
   ========================= */

const observer = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }),
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* =========================
   STITCH CHARACTER
   ========================= */

const stitch = document.getElementById("stitchCharacter");

const Stitch = {
  isBusy: false,
  direction: "right",

  show() {
    stitch.style.visibility = "visible";
    stitch.style.opacity = "1";
  },

  hide() {
    stitch.style.opacity = "0";
    stitch.style.visibility = "hidden";
  },

  face(direction) {
    this.direction = direction;

    const sprite = stitch.querySelector(".stitch-sprite");

    if (direction === "left") {
      sprite.style.transform = "scaleX(-1)";
    } else {
      sprite.style.transform = "scaleX(1)";
    }
  },

  async runAcross() {
    if (this.isBusy) return;

    this.isBusy = true;

    const fromLeft = Math.random() < 0.5;

    this.face(fromLeft ? "right" : "left");
    this.show();

    const startX = fromLeft ? -180 : window.innerWidth + 180;

    const endX = fromLeft ? window.innerWidth + 180 : -180;

    stitch.style.transition = "none";
    stitch.style.transform = `translateX(${startX}px)`;

    // Force the browser to register the starting position
    void stitch.offsetWidth;

    stitch.style.transition = "transform 8s linear";
    stitch.style.transform = `translateX(${endX}px)`;

    await new Promise((resolve) => setTimeout(resolve, 8000));

    this.hide();

    stitch.style.transition = "none";

    this.isBusy = false;
  },
  
  async wander() {
    if (this.isBusy) return;

    this.isBusy = true;

    const fromLeft = Math.random() < 0.5;

    this.face(fromLeft ? "right" : "left");
    this.show();

    const startX = fromLeft
        ? -180
        : window.innerWidth + 180;

    const middleX = window.innerWidth * (Math.random() * 0.4 + 0.3);

    stitch.style.transition = "none";
    stitch.style.transform = `translateX(${startX}px)`;

    void stitch.offsetWidth;

    stitch.style.transition = "transform 3s ease-in-out";
    stitch.style.transform = `translateX(${middleX}px)`;

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Pause and look around
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Turn around
    this.face(fromLeft ? "left" : "right");

    const secondX = fromLeft
        ? middleX - 160
        : middleX + 160;

    stitch.style.transition = "transform 1.8s ease-in-out";
    stitch.style.transform = `translateX(${secondX}px)`;

    await new Promise(resolve => setTimeout(resolve, 1800));

    // Turn back toward the exit
    this.face(fromLeft ? "right" : "left");

    const exitX = fromLeft
        ? window.innerWidth + 180
        : -180;

    stitch.style.transition = "transform 3.5s linear";
    stitch.style.transform = `translateX(${exitX}px)`;

    await new Promise(resolve => setTimeout(resolve, 3500));

    this.hide();
    stitch.style.transition = "none";

    this.isBusy = false;
}
};

/* =========================
   STITCH SCHEDULING
   ========================= */

function scheduleNextStitchAppearance() {
  const delay = Math.random() * 30000 + 30000;

  setTimeout(async () => {
    await Stitch.runAcross();
    scheduleNextStitchAppearance();
  }, delay);
}

const firstStitchAppearance = Math.random() * 5000 + 8000;

setTimeout(async () => {
  await Stitch.runAcross();
  scheduleNextStitchAppearance();
}, firstStitchAppearance);


/* =========================
   RELATIONSHIP TIME COUNTER
   ========================= */
const startTime = new Date("2026-08-29T15:45:00+02:00");

function updateRelationshipTime() {
  const now = new Date();
  let elapsed = Math.floor((now - startTime) / 1000);

  const days = Math.floor(elapsed / 86400);
  elapsed %= 86400;

  const hours = Math.floor(elapsed / 3600);
  elapsed %= 3600;

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const text =
    `${days} days, ` +
    `${hours} hours, ` +
    `${minutes} minutes, ` +
    `${seconds} seconds`;

  const element = document.getElementById("relationship-time");

  if (element) {
    element.textContent = text;
  }
}

updateRelationshipTime();
setInterval(updateRelationshipTime, 1000);
