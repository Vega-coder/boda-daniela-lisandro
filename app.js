/**
 * Invitación de Boda - Lisandro & Daniela
 * Fecha: 27 de Diciembre de 2026 (Ábrego, Norte de Santander)
 * WhatsApp Novios: +57 318 857 2916
 */

document.addEventListener('DOMContentLoaded', () => {

  const WEDDING_CONFIG = {
    groom: "Lisandro",
    bride: "Daniela",
    targetDate: new Date(2026, 11, 27, 17, 0, 0),
    phoneWhatsApp: "573188572916"
  };

  /* ==========================================================================
     1. MÚSICA DE BODA (CANON IN D - PIANO)
     ========================================================================== */
  const audioElement = document.getElementById('wedding-audio');
  const musicController = document.getElementById('music-controller');
  const musicBtn = document.getElementById('music-btn');

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
        [293.66, 369.99, 440.00], [440.00, 587.33],
        [220.00, 277.18, 329.63], [329.63, 440.00],
        [246.94, 293.66, 369.99], [369.99, 493.88],
        [185.00, 220.00, 277.18], [277.18, 369.99],
        [196.00, 246.94, 293.66], [293.66, 392.00],
        [146.83, 220.00, 293.66], [293.66, 369.99],
        [196.00, 246.94, 293.66], [293.66, 392.00],
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
        console.warn("Audio en espera, activando sintetizador nupcial:", err);
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
    audioElement.addEventListener('pause', () => {
      if (!webAudioSynthActive) updateMusicUI(false);
    });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', togglePiano);
    musicBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      togglePiano(e);
    });
  }

  /* ==========================================================================
     2. APERTURA INTERACTIVA DEL SOBRE
     ========================================================================== */
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeInteractive = document.getElementById('envelope-interactive');
  const btnOpenEnvelope = document.getElementById('btn-open-envelope');
  let envelopeOpened = false;

  function triggerOpenEnvelope(e) {
    if (e) e.stopPropagation();
    if (envelopeOpened) return;
    envelopeOpened = true;

    // Iniciar piano de boda al tocar
    playPiano();

    // Animación de solapa y tarjeta
    if (envelopeInteractive) {
      envelopeInteractive.classList.add('is-open');
    }

    // Desvanecer el sobre para revelar la invitación
    setTimeout(() => {
      if (envelopeOverlay) {
        envelopeOverlay.classList.add('fade-out');
        setTimeout(() => {
          envelopeOverlay.style.display = 'none';
        }, 650);
      }
    }, 750);
  }

  if (btnOpenEnvelope) {
    btnOpenEnvelope.addEventListener('click', triggerOpenEnvelope);
    btnOpenEnvelope.addEventListener('touchend', triggerOpenEnvelope, { passive: true });
  }

  if (envelopeInteractive) {
    envelopeInteractive.addEventListener('click', triggerOpenEnvelope);
    envelopeInteractive.addEventListener('touchend', triggerOpenEnvelope, { passive: true });
  }

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', (e) => {
      if (!envelopeOpened) triggerOpenEnvelope(e);
    });
  }

  /* ==========================================================================
     3. CUENTA REGRESIVA
     ========================================================================== */
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = WEDDING_CONFIG.targetDate.getTime() - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     4. BOTÓN GOOGLE CALENDAR
     ========================================================================== */
  const btnGoogleCal = document.getElementById('btn-add-google-cal');
  if (btnGoogleCal) {
    btnGoogleCal.addEventListener('click', () => {
      const calTitle = encodeURIComponent("Boda de Lisandro & Daniela 💍");
      const calDetails = encodeURIComponent("¡Acompáñanos a celebrar nuestra boda!\n\n⛪ Misa: 5:00 PM - Iglesia Santa Bárbara (Ábrego)\n🥂 Recepción: 6:30 PM - Club de los Maestros (Ábrego)");
      const calLocation = encodeURIComponent("Iglesia Santa Bárbara y Club de los Maestros, Ábrego, Norte de Santander");
      const calDates = "20261227T170000/20261228T020000";

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calDates}&details=${calDetails}&location=${calLocation}`;
      window.open(googleCalUrl, '_blank');
    });
  }

  /* ==========================================================================
     5. CONFIRMACIÓN POR WHATSAPP (+57 318 857 2916)
     ========================================================================== */
  const btnWhatsApp = document.getElementById('btn-whatsapp-confirm');
  const guestNameInput = document.getElementById('guest-name');
  const guestsCountSelect = document.getElementById('guests-count');
  const guestMessageInput = document.getElementById('guest-message');

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
      const guestName = guestNameInput ? guestNameInput.value.trim() : '';

      if (!guestName) {
        alert('Por favor escribe tu nombre y apellidos para confirmar tu asistencia.');
        if (guestNameInput) guestNameInput.focus();
        return;
      }

      const guestsCount = guestsCountSelect ? guestsCountSelect.options[guestsCountSelect.selectedIndex].text : '2 Personas';
      const message = guestMessageInput ? guestMessageInput.value.trim() : '';

      let whatsappText = `💍 *CONFIRMACIÓN DE BODA - LISANDRO & DANIELA* 💍\n\n`;
      whatsappText += `🗓 *Fecha:* Domingo, 27 de Diciembre de 2026\n`;
      whatsappText += `⛪ *Misa:* Iglesia Santa Bárbara (Ábrego) - 5:00 PM\n`;
      whatsappText += `🥂 *Recepción:* Club de los Maestros (Ábrego) - 6:30 PM\n\n`;
      whatsappText += `👤 *Invitado:* ${guestName}\n`;
      whatsappText += `✨ *Respuesta:* ¡Sí, asistiré con mucha alegría! 🎉\n`;
      whatsappText += `👥 *Pases / Personas:* ${guestsCount}\n`;
      if (message) {
        whatsappText += `💌 *Dedicatoria:* "${message}"\n`;
      }
      whatsappText += `\n¡Con todo nuestro cariño para Lisandro y Daniela! ✨`;

      const targetPhone = WEDDING_CONFIG.phoneWhatsApp;
      const encodedUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(whatsappText)}`;
      
      window.open(encodedUrl, '_blank');
    });
  }

  /* ==========================================================================
     6. FONDO ANIMADO SUTIL (CANVAS)
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

  const sparkles = [];
  const sparkleCount = window.innerWidth < 768 ? 25 : 45;

  class Sparkle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.alpha = Math.random();
      this.alphaSpeed = Math.random() * 0.02 + 0.01;
      this.rising = Math.random() > 0.5;
    }
    update() {
      if (this.rising) {
        this.alpha += this.alphaSpeed;
        if (this.alpha >= 1) this.rising = false;
      } else {
        this.alpha -= this.alphaSpeed;
        if (this.alpha <= 0.1) {
          this.reset();
          this.rising = true;
        }
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = `rgba(223, 155, 138, ${this.alpha * 0.7})`;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < sparkleCount; i++) sparkles.push(new Sparkle());

  function renderScene() {
    ctx.clearRect(0, 0, width, height);
    sparkles.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(renderScene);
  }
  renderScene();

});
