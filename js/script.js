/* =========================
   STITCH EASTER EGG
   ========================= */

const stitch = document.getElementById("stitchEasterEgg");

function makeStitchRun() {

    // Reset previous animation
    stitch.classList.remove("run-left", "run-right");

    // Force the browser to restart the animation
    void stitch.offsetWidth;

    // Randomly choose which side Stitch comes from
    if (Math.random() < 0.5) {
        stitch.classList.add("run-left");
    } else {
        stitch.classList.add("run-right");
    }

    // Next appearance: random 30–60 seconds
    const nextRun = Math.random() * 30000 + 30000;

    setTimeout(makeStitchRun, nextRun);
}

// First appearance: random 8–13 seconds
const firstAppearance = Math.random() * 5000 + 8000;

setTimeout(makeStitchRun, firstAppearance);

const observer = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }),
  { threshold: .12 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


const startTime = new Date('2026-08-29T15:45:00+02:00');

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

  const element = document.getElementById('relationship-time');

  if (element) {
    element.textContent = text;
  }
}

updateRelationshipTime();
setInterval(updateRelationshipTime, 1000);