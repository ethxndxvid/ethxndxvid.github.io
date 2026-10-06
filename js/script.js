/* =========================
   STITCH EASTER EGG
   ========================= */

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

        const startX = fromLeft
            ? -180
            : window.innerWidth + 180;

        const endX = fromLeft
            ? window.innerWidth + 180
            : -180;

        stitch.style.transition = "none";
        stitch.style.transform = `translateX(${startX}px)`;

        // Force the browser to register the starting position
        void stitch.offsetWidth;

        stitch.style.transition = "transform 8s linear";
        stitch.style.transform = `translateX(${endX}px)`;

        await new Promise(resolve => setTimeout(resolve, 8000));

        this.hide();

        stitch.style.transition = "none";

        this.isBusy = false;
    }
};

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