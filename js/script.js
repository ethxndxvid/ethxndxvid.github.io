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
},

async perch() {
    if (this.isBusy) return;

    this.isBusy = true;

    // Find actual visible letter cards
    const candidates = [...document.querySelectorAll(".letter")].filter(el => {
        const rect = el.getBoundingClientRect();

        return (
            rect.top > 100 &&
            rect.top < window.innerHeight - 120 &&
            rect.bottom > 150
        );
    });

    // If there are no usable cards on screen, fall back to wandering
    if (candidates.length === 0) {
        this.isBusy = false;
        return this.wander();
    }

    const target =
        candidates[Math.floor(Math.random() * candidates.length)];

    const rect = target.getBoundingClientRect();

    // Pick somewhere along the top edge of the card
    const targetX = Math.max(
        40,
        Math.min(
            window.innerWidth - 190,
            rect.left + rect.width * 0.65
        )
    );

    // Where Stitch should stand before jumping
    const groundX = targetX;

    // Align Stitch's bottom with the top edge of the card
    const perchBottom =
        window.innerHeight - rect.top - 5;

    const enterFromLeft = targetX < window.innerWidth / 2;

    const startX = enterFromLeft
        ? -180
        : window.innerWidth + 180;

    this.face(enterFromLeft ? "right" : "left");
    this.show();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";
    stitch.style.transform = `translateX(${startX}px)`;

    void stitch.offsetWidth;

    // 1. Run along the bottom toward the card
    stitch.style.transition = "transform 2.5s ease-out";
    stitch.style.transform = `translateX(${groundX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    // 2. Jump upward onto the top edge
    stitch.style.transition =
        "bottom 700ms cubic-bezier(.2,.8,.3,1)";

    stitch.style.bottom = `${perchBottom}px`;

    await new Promise(resolve => setTimeout(resolve, 700));

    // 3. Sit there
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Jump back down
    stitch.style.transition =
        "bottom 600ms ease-in";

    stitch.style.bottom = "20px";

    await new Promise(resolve => setTimeout(resolve, 600));

    // 5. Leave
    const exitLeft = groundX < window.innerWidth / 2;

    this.face(exitLeft ? "left" : "right");

    const exitX = exitLeft
        ? -200
        : window.innerWidth + 200;

    stitch.style.transition = "transform 2.5s ease-in";
    stitch.style.transform = `translateX(${exitX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    this.hide();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";

    this.isBusy = false;
},

async peek() {
    if (this.isBusy) return;

    this.isBusy = true;

    const candidates = [...document.querySelectorAll(".letter")].filter(el => {
        const rect = el.getBoundingClientRect();

        return (
            rect.top < window.innerHeight - 100 &&
            rect.bottom > 100 &&
            rect.width > 180
        );
    });

    if (candidates.length === 0) {
        this.isBusy = false;
        return this.wander();
    }

    const target =
        candidates[Math.floor(Math.random() * candidates.length)];

    const rect = target.getBoundingClientRect();

    const peekFromLeft = Math.random() < 0.5;

    const targetX = peekFromLeft
        ? rect.left - 90
        : rect.right - 60;

    const targetY =
        window.innerHeight - rect.top - 80;

    this.face(peekFromLeft ? "right" : "left");
    this.show();

    stitch.style.transition = "none";
    stitch.style.bottom = `${targetY}px`;

    const hiddenX = peekFromLeft
        ? targetX - 70
        : targetX + 70;

    stitch.style.transform = `translateX(${hiddenX}px)`;

    void stitch.offsetWidth;

    // Peek out
    stitch.style.transition = "transform 700ms ease-out";
    stitch.style.transform = `translateX(${targetX}px)`;

    await new Promise(resolve => setTimeout(resolve, 700));

    // Stay there looking around
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Hide again
    stitch.style.transition = "transform 700ms ease-in";
    stitch.style.transform = `translateX(${hiddenX}px)`;

    await new Promise(resolve => setTimeout(resolve, 700));

    this.hide();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";

    this.isBusy = false;
},

async readLetter() {
    if (this.isBusy) return;

    this.isBusy = true;

    const target = document.querySelector(".letter");

    if (!target) {
        this.isBusy = false;
        return this.wander();
    }

    const rect = target.getBoundingClientRect();

    const isVisible =
        rect.top < window.innerHeight - 100 &&
        rect.bottom > 100;

    if (!isVisible) {
        this.isBusy = false;
        return this.wander();
    }

    const targetX = Math.max(
        40,
        Math.min(
            window.innerWidth - 190,
            rect.left + rect.width * 0.72
        )
    );

    const perchBottom =
        window.innerHeight - rect.top - 5;

    const enterFromLeft =
        targetX < window.innerWidth / 2;

    const startX = enterFromLeft
        ? -180
        : window.innerWidth + 180;

    this.face(enterFromLeft ? "right" : "left");
    this.show();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";
    stitch.style.transform = `translateX(${startX}px)`;

    void stitch.offsetWidth;

    // Walk toward the letter
    stitch.style.transition = "transform 2.5s ease-out";
    stitch.style.transform = `translateX(${targetX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    // Jump onto the letter
    stitch.style.transition =
        "bottom 700ms cubic-bezier(.2,.8,.3,1)";

    stitch.style.bottom = `${perchBottom}px`;

    await new Promise(resolve => setTimeout(resolve, 700));

    // Face inward as if reading
    this.face("left");

    // Tiny pause before "reading"
    await new Promise(resolve => setTimeout(resolve, 500));

    // Read for a while
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Jump back down
    stitch.style.transition = "bottom 600ms ease-in";
    stitch.style.bottom = "20px";

    await new Promise(resolve => setTimeout(resolve, 600));

    // Leave
    const exitLeft = targetX < window.innerWidth / 2;

    this.face(exitLeft ? "left" : "right");

    const exitX = exitLeft
        ? -200
        : window.innerWidth + 200;

    stitch.style.transition = "transform 2.5s ease-in";
    stitch.style.transform = `translateX(${exitX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    this.hide();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";

    this.isBusy = false;
},

async inspectTerminal() {
    if (this.isBusy) return;

    this.isBusy = true;

    const target = document.querySelector(".terminal");

    if (!target) {
        this.isBusy = false;
        return this.wander();
    }

    const rect = target.getBoundingClientRect();

    const isVisible =
        rect.top < window.innerHeight - 100 &&
        rect.bottom > 100;

    if (!isVisible) {
        this.isBusy = false;
        return this.wander();
    }

    const targetX = Math.max(
        40,
        Math.min(
            window.innerWidth - 190,
            rect.left + rect.width * 0.70
        )
    );

    const perchBottom =
        window.innerHeight - rect.top - 5;

    const enterFromLeft =
        targetX < window.innerWidth / 2;

    const startX = enterFromLeft
        ? -180
        : window.innerWidth + 180;

    this.face(enterFromLeft ? "right" : "left");
    this.show();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";
    stitch.style.transform = `translateX(${startX}px)`;

    void stitch.offsetWidth;

    // Walk toward the terminal
    stitch.style.transition = "transform 2.5s ease-out";
    stitch.style.transform = `translateX(${targetX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    // Jump onto the terminal
    stitch.style.transition =
        "bottom 700ms cubic-bezier(.2,.8,.3,1)";

    stitch.style.bottom = `${perchBottom}px`;

    await new Promise(resolve => setTimeout(resolve, 700));

    // Face inward like he's reading it
    this.face("left");

    await new Promise(resolve => setTimeout(resolve, 500));

    // Inspect terminal
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Jump down
    stitch.style.transition = "bottom 600ms ease-in";
    stitch.style.bottom = "20px";

    await new Promise(resolve => setTimeout(resolve, 600));

    // Leave
    const exitLeft = targetX < window.innerWidth / 2;

    this.face(exitLeft ? "left" : "right");

    const exitX = exitLeft
        ? -200
        : window.innerWidth + 200;

    stitch.style.transition = "transform 2.5s ease-in";
    stitch.style.transform = `translateX(${exitX}px)`;

    await new Promise(resolve => setTimeout(resolve, 2500));

    this.hide();

    stitch.style.transition = "none";
    stitch.style.bottom = "20px";

    this.isBusy = false;
}
};

/* =========================
   STITCH SCHEDULING
   ========================= */

/* =========================
   STITCH SCHEDULING
   ========================= */

function chooseStitchBehaviour() {
    const roll = Math.random();

    if (roll < 0.50) {
        return Stitch.runAcross();
    }

    if (roll < 0.80) {
        return Stitch.wander();
    }

    return Stitch.perch();
}

function scheduleNextStitchAppearance() {
    const delay = Math.random() * 30000 + 30000;

    setTimeout(async () => {
        await chooseStitchBehaviour();
        scheduleNextStitchAppearance();
    }, delay);
}

const firstStitchAppearance = Math.random() * 5000 + 8000;

setTimeout(async () => {
    await chooseStitchBehaviour();
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
