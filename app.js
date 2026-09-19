/**
 * Invitación de Boda Interactiva - Lisandro & Daniela
 * Fecha: 27 de Diciembre de 2026
 * Ceremonia: Iglesia Santa Bárbara en Ábrego (5:00 PM)
 * Recepción: Club de los Maestros (6:30 PM)
 * Teléfono vinculado WhatsApp: +57 318 857 2916
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CONFIGURACIÓN DEL EVENTO
     ========================================================================== */
  const WEDDING_CONFIG = {
    groom: "Lisandro",
    bride: "Daniela",
    targetDate: new Date(2026, 11, 27, 17, 0, 0), // 27 Diciembre 2026 a las 17:00 hrs
    church: "Iglesia Santa Bárbara, Ábrego",
    reception: "Club de los Maestros, Ábrego",
    churchTime: "5:00 PM",
    receptionTime: "6:30 PM",
    phoneWhatsApp: "573188572916" // Número directo de WhatsApp
  };

  /* ==========================================================================
     2. CUENTA REGRESIVA
     ========================================================================== */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.targetDate.getTime() - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '000';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     3. SOBRE 3D INTERACTIVO & REPRODUCTOR DE PIANO NUPCIAL
     ========================================================================== */
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeInteractive = document.getElementById('envelope-interactive');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const btnTouchEnvelope = document.getElementById('btn-touch-envelope');
  const audioElement = document.getElementById('wedding-audio');
  const musicController = document.getElementById('music-controller');
  const musicBtn = document.getElementById('music-btn');

  let envelopeHasOpened = false;
  let webAudioSynthActive = false;
  let webAudioCtx = null;

  function updateMusicUI(active) {
    if (!musicController) return;
    if (active) {
      musicController.classList.add('playing');
    } else {
      musicController.classList.remove('playing');
    }
  }

  // Sintetizador Web Audio de respaldo (Canon in D) por si el MP3 tarda en cargar o se bloquea
  function startWebAudioFallback() {
    if (webAudioSynthActive) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;
      if (!webAudioCtx) webAudioCtx = new AudioCtxClass();
      if (webAudioCtx.state === 'suspended') webAudioCtx.resume();

      webAudioSynthActive = true;
      updateMusicUI(true);

      const notes = [
        // D major
        [293.66, 369.99, 440.00], [440.00, 587.33],
        // A major
        [220.00, 277.18, 329.63], [329.63, 440.00],
        // B minor
        [246.94, 293.66, 369.99], [369.99, 493.88],
        // F# minor
        [185.00, 220.00, 277.18], [277.18, 369.99],
        // G major
        [196.00, 246.94, 293.66], [293.66, 392.00],
        // D major
        [146.83, 220.00, 293.66], [293.66, 369.99],
        // G major
        [196.00, 246.94, 293.66], [293.66, 392.00],
        // A major
        [220.00, 277.18, 329.63], [329.63, 440.00]
      ];

      let step = 0;
      const interval = setInterval(() => {
        if (!webAudioSynthActive || (audioElement && !audioElement.paused && audioElement.currentTime > 0)) {
          clearInterval(interval);
          webAudioSynthActive = false;
          return;
        }

        const chord = notes[step % notes.length];
        step++;

        chord.forEach(freq => {
          if (!webAudioCtx) return;
          const osc = webAudioCtx.createOscillator();
          const gain = webAudioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, webAudioCtx.currentTime);

          gain.gain.setValueAtTime(0.08, webAudioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, webAudioCtx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(webAudioCtx.destination);

          osc.start();
          osc.stop(webAudioCtx.currentTime + 1.2);
        });
      }, 750);
    } catch (e) {
      console.warn("Web Audio no disponible:", e);
    }
  }

  function stopWebAudioFallback() {
    webAudioSynthActive = false;
    if (webAudioCtx && webAudioCtx.state === 'running') {
      try { webAudioCtx.suspend(); } catch(e) {}
    }
  }

  function playPiano() {
    if (!audioElement) return;
    audioElement.volume = 1.0;
    audioElement.muted = false;

    if (!audioElement.src || audioElement.src === '' || audioElement.src === window.location.href) {
      audioElement.src = 'assets/audio/musica-boda.mp3';
    }

    const promise = audioElement.play();
    if (promise !== undefined) {
      promise.then(() => {
        stopWebAudioFallback();
        updateMusicUI(true);
      }).catch(err => {
        console.warn("Reproducción en espera o bloqueada, activando sintetizador nupcial:", err);
        startWebAudioFallback();
      });
    } else {
      updateMusicUI(true);
    }
  }

  function pausePiano() {
    stopWebAudioFallback();
    if (audioElement) {
      audioElement.pause();
    }
    updateMusicUI(false);
  }

  function togglePiano(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!audioElement) return;

    if (audioElement.paused && !webAudioSynthActive) {
      playPiano();
    } else {
      pausePiano();
    }
  }

  if (audioElement) {
    audioElement.addEventListener('play', () => {
      stopWebAudioFallback();
      updateMusicUI(true);
    });
    audioElement.addEventListener('playing', () => {
      stopWebAudioFallback();
      updateMusicUI(true);
    });
    audioElement.addEventListener('pause', () => {
      if (!webAudioSynthActive) updateMusicUI(false);
    });
    audioElement.addEventListener('ended', () => {
      if (!webAudioSynthActive) updateMusicUI(false);
    });
  }

  function triggerEnvelopeOpen() {
    if (envelopeHasOpened) return;
    envelopeHasOpened = true;

    // 1. Iniciar inmediatamente la música (gesto del usuario)
    playPiano();

    // 2. Abrir solapa 3D del sobre y desplegar carta
    if (envelopeInteractive) {
      envelopeInteractive.classList.add('is-open');
    }

    // 3. Estallido de chispas doradas
    burstGoldSparkles(window.innerWidth / 2, window.innerHeight / 2);

    // 4. Desvanecer suavemente el telón del sobre
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('opened');
      }
    }, 1600);
  }

  // Vincular eventos táctiles y de clic para apertura instantánea en móviles
  const bindOpen = (el) => {
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      triggerEnvelopeOpen();
    });
    el.addEventListener('touchend', (e) => {
      e.stopPropagation();
      triggerEnvelopeOpen();
    }, { passive: true });
  };

  bindOpen(envelopeRibbon);
  bindOpen(openEnvelopeBtn);
  bindOpen(btnTouchEnvelope);
  bindOpen(envelopeInteractive);

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', () => {
      if (!envelopeHasOpened) triggerEnvelopeOpen();
    });
    envelopeOverlay.addEventListener('touchend', () => {
      if (!envelopeHasOpened) triggerEnvelopeOpen();
    }, { passive: true });
  }

  if (envelopeRibbon) {
    envelopeRibbon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerEnvelopeOpen();
      }
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', togglePiano);
    musicBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      togglePiano(e);
    });
  }

  // Respaldo global para móviles: al primer toque tras abrir el sobre, si aún no sonaba, se reanuda
  const handleUniversalUserGesture = () => {
    if (envelopeHasOpened && audioElement && audioElement.paused && !webAudioSynthActive) {
      playPiano();
    }
  };
  document.addEventListener('touchstart', handleUniversalUserGesture, { passive: true });
  document.addEventListener('click', handleUniversalUserGesture);

  /* ==========================================================================
     4. CARRUSEL INTERACTIVO DE FOTOS
     ========================================================================== */
  const track = document.getElementById('carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-pills .pill');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  let currentSlide = 0;
  let autoTimer = null;
  const slideCount = slides.length;

  function updateCarousel(index) {
    currentSlide = (index + slideCount) % slideCount;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() { updateCarousel(currentSlide + 1); }
  function prevSlide() { updateCarousel(currentSlide - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartAutoSlide(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
      restartAutoSlide();
    });
  });

  function startAutoSlide() {
    stopAutoSlide();
    autoTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  if (track) {
    startAutoSlide();
  }

  /* ==========================================================================
     5. LIGHTBOX MODAL PARA TODAS LAS FOTOS DE LA BODA
     ========================================================================== */
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const allZoomBtns = document.querySelectorAll('.btn-zoom-main, .btn-zoom-photo-card, .btn-zoom-slide');

  allZoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const src = btn.getAttribute('data-src');
      if (lightboxImage && lightboxModal && src) {
        lightboxImage.src = src;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      if (lightboxImage) lightboxImage.src = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     6. CONFIRMACIÓN DE ASISTENCIA POR WHATSAPP (318 8572916)
     ========================================================================== */
  const btnWhatsApp = document.getElementById('btn-whatsapp-confirm');
  const guestNameInput = document.getElementById('guest-name');
  const rsvpStatusSelect = document.getElementById('rsvp-status');
  const guestsCountSelect = document.getElementById('guests-count');
  const guestsCountField = document.getElementById('guests-count-field');
  const guestMessageInput = document.getElementById('guest-message');

  if (rsvpStatusSelect && guestsCountField) {
    rsvpStatusSelect.addEventListener('change', () => {
      if (rsvpStatusSelect.value === 'no') {
        guestsCountField.style.opacity = '0.5';
      } else {
        guestsCountField.style.opacity = '1';
      }
    });
  }

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const guestName = guestNameInput ? guestNameInput.value.trim() : '';

      if (!guestName) {
        alert('Por favor escribe tu nombre y apellidos para que Lisandro y Daniela sepan quién confirma.');
        if (guestNameInput) guestNameInput.focus();
        return;
      }

      const statusVal = rsvpStatusSelect ? rsvpStatusSelect.value : 'si';
      const isAttending = statusVal === 'si';
      const statusText = isAttending ? "¡Sí, asistiré con mucha alegría! 💍🎉" : "Lamentablemente no podré asistir 🤍";
      const guestsCount = guestsCountSelect ? guestsCountSelect.options[guestsCountSelect.selectedIndex].text : '2 Personas';
      const message = guestMessageInput ? guestMessageInput.value.trim() : '';

      let whatsappText = `💍 *CONFIRMACIÓN DE BODA - LISANDRO & DANIELA* 💍\n\n`;
      whatsappText += `🗓 *Fecha:* Domingo, 27 de Diciembre de 2026\n`;
      whatsappText += `⛪ *Misa:* Iglesia Santa Bárbara (Ábrego) - 5:00 PM\n`;
      whatsappText += `🥂 *Recepción:* Club de los Maestros (Ábrego) - 6:30 PM\n\n`;
      whatsappText += `👤 *Invitado:* ${guestName}\n`;
      whatsappText += `✨ *Respuesta:* ${statusText}\n`;
      if (isAttending) {
        whatsappText += `👥 *Pases / Personas:* ${guestsCount}\n`;
      }
      if (message) {
        whatsappText += `💌 *Dedicatoria especial:* "${message}"\n`;
      }
      whatsappText += `\n¡Con todo nuestro cariño para Lisandro y Daniela! ✨`;

      const targetPhone = WEDDING_CONFIG.phoneWhatsApp;
      const encodedUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(whatsappText)}`;
      
      window.open(encodedUrl, '_blank');
    });
  }

  /* ==========================================================================
     7. RECORDATORIOS DE CALENDARIO
     ========================================================================== */
  const btnGoogleCal = document.getElementById('btn-add-google-cal');
  const btnDownloadIcs = document.getElementById('btn-download-ics');

  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const calTitle = encodeURIComponent("Boda de Lisandro & Daniela 💍");
      const calDetails = encodeURIComponent("¡Acompáñanos a celebrar nuestra boda!\n\n⛪ Misa Nupcial: 5:00 PM - Iglesia Santa Bárbara (Ábrego)\n🥂 Recepción & Fiesta: 6:30 PM - Club de los Maestros (Ábrego)\n\n¡Te esperamos con mucha emoción!");
      const calLocation = encodeURIComponent("Iglesia Santa Bárbara y Club de los Maestros, Ábrego, Norte de Santander");
      const calDates = "20261227T170000/20261228T020000";

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calDates}&details=${calDetails}&location=${calLocation}`;
      window.open(googleCalUrl, '_blank');
    });
  }

  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Lisandro & Daniela//Invitacion de Boda//ES",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        "SUMMARY:Boda de Lisandro y Daniela 💍",
        "DESCRIPTION:Celebración del matrimonio de Lisandro y Daniela.\\nMisa: 5:00 PM en Iglesia Santa Bárbara\\nRecepción: 6:30 PM en Club de los Maestros",
        "LOCATION:Iglesia Santa Bárbara y Club de los Maestros, Ábrego",
        "DTSTART:20261227T170000",
        "DTEND:20261228T020000",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Boda-Lisandro-y-Daniela.ics";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  /* ==========================================================================
     8. FONDO ANIMADO: PÉTALOS & DESTELLOS DE ORO (CANVAS 60 FPS)
     ========================================================================== */
  const canvas = document.getElementById('animated-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = window.innerWidth < 768 ? 20 : 36;

  const sparkles = [];
  const sparkleCount = window.innerWidth < 768 ? 40 : 80;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 11 + 9;
      this.speedY = Math.random() * 1.1 + 0.5;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.swing = Math.random() * Math.PI * 2;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.45 + 0.35;
      const colors = [
        'rgba(186, 36, 68,',   // Rojo rubí
        'rgba(142, 21, 52,',   // Borgoña / terciopelo
        'rgba(226, 120, 145,', // Rosa romántico
        'rgba(242, 175, 190,'  // Pétalo suave
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 0.7 + this.speedX;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.sin(this.swing * 0.7), 1);

      ctx.fillStyle = `${this.colorBase} ${this.opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size * 1.3);
      ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
      ctx.fill();

      ctx.restore();
    }
  }

  class Sparkle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.isStar = Math.random() > 0.4; // 60% estrellas con destello brillante
      this.size = this.isStar ? Math.random() * 4.5 + 2.5 : Math.random() * 2.5 + 1;
      this.maxOpacity = Math.random() * 0.85 + 0.35;
      this.currentOpacity = Math.random() * this.maxOpacity;
      this.fadeSpeed = Math.random() * 0.02 + 0.008;
      this.growing = Math.random() > 0.5;
      this.driftX = (Math.random() - 0.5) * 0.4;
      this.driftY = (Math.random() - 0.5) * 0.5;
      this.rotation = Math.random() * Math.PI;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
    }

    update() {
      this.x += this.driftX;
      this.y += this.driftY;
      this.rotation += this.rotSpeed;

      if (this.growing) {
        this.currentOpacity += this.fadeSpeed;
        if (this.currentOpacity >= this.maxOpacity) this.growing = false;
      } else {
        this.currentOpacity -= this.fadeSpeed;
        if (this.currentOpacity <= 0.04) {
          this.growing = true;
          this.x = Math.random() * width;
          this.y = Math.random() * height;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isStar) {
        // Estrella de 4 puntas con destello de brillo tipo diamante
        ctx.fillStyle = `rgba(255, 235, 175, ${this.currentOpacity})`;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        const r = this.size;
        const inset = r * 0.22;
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.quadraticCurveTo(0, 0, 0, r);
        ctx.quadraticCurveTo(0, 0, -r, 0);
        ctx.quadraticCurveTo(0, 0, 0, -r);
        ctx.fill();

        // Punto central brillante
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, this.currentOpacity + 0.3)})`;
        ctx.beginPath();
        ctx.arc(0, 0, inset, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Destello circular suave
        ctx.fillStyle = `rgba(235, 185, 195, ${this.currentOpacity})`;
        ctx.shadowColor = 'rgba(255, 180, 195, 0.8)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) petals.push(new Petal());
  for (let i = 0; i < sparkleCount; i++) sparkles.push(new Sparkle());

  function burstGoldSparkles(originX, originY) {
    for (let i = 0; i < 55; i++) {
      const s = new Sparkle();
      s.x = originX;
      s.y = originY;
      s.driftX = (Math.random() - 0.5) * 8;
      s.driftY = (Math.random() - 0.5) * 8;
      s.currentOpacity = 1;
      s.maxOpacity = 1;
      s.size = Math.random() * 6 + 3;
      s.fadeSpeed = 0.025;
      s.isStar = true;
      sparkles.push(s);
    }
  }

  function renderScene() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < sparkles.length; i++) {
      sparkles[i].update();
      sparkles[i].draw();
    }
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(renderScene);
  }

  renderScene();
});
