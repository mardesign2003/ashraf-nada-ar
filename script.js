"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const letterIntro = document.getElementById("letterIntro");
  const envelopeWrap = document.getElementById("envelopeWrap");
  const waxSeal = document.getElementById("waxSeal");
  const invitationContent = document.getElementById("invitationContent");
  const backgroundMusic = document.getElementById("backgroundMusic");
  const musicButton = document.getElementById("musicButton");

  let invitationOpened = false;
  let musicPlaying = false;

  function showInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    if (envelopeWrap) {
      envelopeWrap.classList.add("is-opening");
    }

    if (waxSeal) {
      waxSeal.disabled = true;
      waxSeal.setAttribute("aria-disabled", "true");
    }

    if (backgroundMusic) {
      backgroundMusic.volume = 0.45;
      backgroundMusic.play()
        .then(() => {
          musicPlaying = true;
          if (musicButton) {
            musicButton.textContent = "❚❚";
            musicButton.setAttribute("aria-label", "Pause music");
          }
        })
        .catch(() => {
          musicPlaying = false;
          if (musicButton) {
            musicButton.textContent = "♫";
            musicButton.setAttribute("aria-label", "Play music");
          }
        });
    }

    window.setTimeout(() => {
      if (letterIntro) {
        letterIntro.classList.add("opened");
        letterIntro.setAttribute("aria-hidden", "true");
      }

      body.classList.remove("page-locked");

      if (invitationContent) {
        invitationContent.classList.add("is-visible");
        invitationContent.setAttribute("aria-hidden", "false");
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1050);
  }

  if (waxSeal) {
    waxSeal.addEventListener("click", showInvitation);
    waxSeal.addEventListener("touchend", (event) => {
      event.preventDefault();
      showInvitation();
    }, { passive: false });
  } else {
    body.classList.remove("page-locked");
    if (letterIntro) letterIntro.classList.add("opened");
  }

  if (envelopeWrap) {
    envelopeWrap.addEventListener("click", (event) => {
      if (event.target === waxSeal || waxSeal?.contains(event.target)) return;
      showInvitation();
    });
  }

  /* Countdown to September 17, 2026 - 19:00 (Cairo Time) */
  const eventDate = new Date("2026-09-17T19:00:00+03:00");

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function updateCountdown() {
    const difference = eventDate.getTime() - Date.now();
    const countdown = document.getElementById("countdown");

    if (!countdown) return;

    if (difference <= 0) {
      countdown.innerHTML = "<h2>Today is the day! 💍💕</h2>";
      return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setText("days", String(days).padStart(2, "0"));
    setText("hours", String(hours).padStart(2, "0"));
    setText("minutes", String(minutes).padStart(2, "0"));
    setText("seconds", String(seconds).padStart(2, "0"));
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  /* Bubbles */
  const bubbleLayer = document.getElementById("bubbleLayer");

  function createBubble(initial = false) {
    if (!bubbleLayer) return;

    const bubble = document.createElement("span");
    bubble.className = "bubble";

    const size = Math.floor(Math.random() * 62) + 10;
    const duration = Math.random() * 6 + 7;
    const delay = initial ? -Math.random() * duration : Math.random() * 1.2;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${duration}s`;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.setProperty("--drift", `${Math.floor(Math.random() * 220) - 110}px`);

    bubbleLayer.appendChild(bubble);

    window.setTimeout(
      () => bubble.remove(),
      (duration + Math.max(delay, 0) + 1) * 1000
    );
  }

  for (let index = 0; index < 28; index += 1) {
    createBubble(true);
  }

  window.setInterval(() => createBubble(false), 380);

  /* Pearl frame */
  const frame = document.getElementById("invitationFrame");
  const frameDecorations = document.getElementById("frameDecorations");
  let resizeTimer;

  function addFramePearls() {
    if (!frame || !frameDecorations) return;

    frameDecorations.innerHTML = "";

    const width = frame.clientWidth;
    const height = frame.clientHeight;
    const isMobile = window.innerWidth <= 540;
    const spacing = isMobile ? 24 : 31;
    const inset = isMobile ? 13 : 14;
    const rightInset = isMobile ? 19 : 22;
    const points = [];

    for (let x = 28; x <= width - 28; x += spacing) {
      points.push({ x, y: inset });
    }

    for (let y = 36; y <= height - 36; y += spacing) {
      points.push({ x: width - rightInset, y });
    }

    for (let x = width - 28; x >= 28; x -= spacing) {
      points.push({ x, y: height - inset });
    }

    for (let y = height - 36; y >= 36; y -= spacing) {
      points.push({ x: inset, y });
    }

    points.forEach((point) => {
      const pearl = document.createElement("span");
      pearl.className = "frame-pearl";

      const pearlSize = isMobile
        ? Math.floor(Math.random() * 4) + 8
        : Math.floor(Math.random() * 5) + 10;

      pearl.style.width = `${pearlSize}px`;
      pearl.style.height = `${pearlSize}px`;
      pearl.style.left = `${point.x}px`;
      pearl.style.top = `${point.y}px`;

      frameDecorations.appendChild(pearl);
    });
  }

  addFramePearls();

  window.addEventListener("load", addFramePearls);
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(addFramePearls, 120);
  });

  /* Music control */
  if (musicButton && backgroundMusic) {
    musicButton.addEventListener("click", async () => {
      try {
        if (backgroundMusic.paused) {
          backgroundMusic.volume = 0.45;
          await backgroundMusic.play();
          musicPlaying = true;
          musicButton.textContent = "❚❚";
          musicButton.setAttribute("aria-label", "Pause music");
        } else {
          backgroundMusic.pause();
          musicPlaying = false;
          musicButton.textContent = "♫";
          musicButton.setAttribute("aria-label", "Play music");
        }
      } catch (error) {
        musicPlaying = false;
        musicButton.textContent = "♫";
        console.warn("Music file is missing or playback was blocked.", error);
      }
    });
  }

  window.downloadCalendarEvent = function downloadCalendarEvent() {
    const calendarContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "SUMMARY:Ashraf & Nada Katb Ketab Ceremony",
      "DTSTART:20260917T160000Z",
      "DTEND:20260917T180000Z",
      "DESCRIPTION:Join Ashraf and Nada for their Katb Ketab celebration.",
      "LOCATION:Rawda Hall Inside El-Moshir Tantawy Mosque",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const file = new Blob([calendarContent], {
      type: "text/calendar;charset=utf-8"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = "ashraf-nada-katb-ketab.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
});