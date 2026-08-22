const intro = document.getElementById("intro");
const passwordScreen = document.getElementById("passwordScreen");
const prophecyScreen = document.getElementById("prophecyScreen");
const chaosScreen = document.getElementById("chaosScreen");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const backBtn = document.getElementById("backBtn");

const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");

const music = document.getElementById("music");
const countdown = document.getElementById("countdown");

function showScreen(screen) {
  [intro, passwordScreen, prophecyScreen, chaosScreen].forEach((item) => {
    item.classList.add("hidden");
    item.classList.remove("active");
  });

  screen.classList.remove("hidden");
  screen.classList.add("active");
}

let musicStarted = false;
let musicRetryInstalled = false;

function startMusic() {
  // El audio se inicia directamente dentro de la interacción del usuario
  // (SÍ/NO), evitando el bloqueo de autoplay de los navegadores.
  if (!music) return;

  music.volume = 0.45;
  music.loop = true;

  const playPromise = music.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        musicStarted = true;
      })
      .catch((error) => {
        // Si el navegador todavía bloquea la reproducción, reintentamos
        // automáticamente en la siguiente interacción del usuario, sin
        // añadir ningún elemento visual a la página.
        if (!musicRetryInstalled) {
          musicRetryInstalled = true;
          const retryMusic = () => {
            music.play()
              .then(() => {
                musicStarted = true;
                document.removeEventListener("pointerdown", retryMusic);
                document.removeEventListener("keydown", retryMusic);
              })
              .catch(() => {});
          };
          document.addEventListener("pointerdown", retryMusic, { once: true });
          document.addEventListener("keydown", retryMusic, { once: true });
        }
        console.warn("No se pudo iniciar la música:", error);
      });
  }
}

yesBtn.addEventListener("click", () => {
  startMusic();
  passwordInput.value = "";
  passwordError.classList.add("hidden");
  showScreen(passwordScreen);
  passwordInput.focus();
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answer = passwordInput.value.trim();

  if (answer.toLowerCase() === "amanda") {
    passwordError.classList.add("hidden");
    showScreen(prophecyScreen);
    return;
  }

  passwordError.textContent = "RESPUESTA INCORRECTA.";
  passwordError.classList.remove("hidden");
  passwordInput.focus();
});

noBtn.addEventListener("click", () => {
  startMusic();
  document.body.classList.add("glitch");

  setTimeout(() => {
    showScreen(chaosScreen);
    document.body.classList.remove("glitch");
  }, 450);
});

backBtn.addEventListener("click", () => {
  showScreen(intro);
});

// ----------------------------------------------------
// CUENTA ATRÁS
// Termina el 30 de agosto de 2026 a las 23:59:59.
// ----------------------------------------------------
const targetDate = new Date("2026-08-30T23:59:59");

function updateCountdown() {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    countdown.textContent = "EL MOMENTO HA LLEGADO";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.textContent =
    `${String(days).padStart(3, "0")}D ` +
    `${String(hours).padStart(2, "0")}H ` +
    `${String(minutes).padStart(2, "0")}M ` +
    `${String(seconds).padStart(2, "0")}S`;
}

updateCountdown();
setInterval(updateCountdown, 1000);
